import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import Swal from 'sweetalert2';

export default function DashboardAdmin() {
    const [quiz, setQuiz] = useState([]);
    const [isActiveList, setIsActiveList] = useState(false); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = isActiveList ? "http://api-quiz-arras.my.id:8080/api/quiz/is-active" : "http://api-quiz-arras.my.id:8080/api/quiz/";
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setQuiz(data.payload);
                } else {
                    console.error("Failed to fetch quiz data:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching quiz data:", error);
            }
        };

        fetchData();
    }, [isActiveList]); 

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const parsedDate = parseISO(dateString);
        return format(parsedDate, "dd MMMM yyyy, HH:mm");
    };

    const handleDeleteQuiz = async (id) => {
        try {
            const response = await fetch(`http://api-quiz-arras.my.id:8080/api/quiz/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
                }
            });
            if (response.ok) {
                const updatedQuiz = quiz.filter((item) => item.ID !== id);
                setQuiz(updatedQuiz);
                Swal.fire({
                    icon: 'success',
                    title: 'Quiz deleted successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                console.error("Failed to delete quiz:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting quiz:", error);
        }
    };

    const handleConfirmDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteQuiz(id);
            }
        });
    };

    const handleLogout = async (e) => {
    e.preventDefault();
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, log out'
    }).then((result) => {
        if (result.isConfirmed) {
            sessionStorage.removeItem("token");
            window.location.href = "/login"; 
        }
    });
    };


    return (
        <div className="mx-5 px-[15%] pt-24">
            <Header />
            <h1 className="text-3xl font-bold text-center mb-10">List Quiz</h1>
            <div className="flex justify-between mb-5">
                <div>
                    <Link to="/create-quiz">
                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mr-3">
                            Create Quiz
                        </button>
                    </Link>
                </div>
                <div>
                    <button onClick={() => setIsActiveList(!isActiveList)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                        {isActiveList ? "List Quiz Active" : "All Quizzes"}
                    </button>
                </div>
            </div>
            <div>
                {quiz.map((item) => (
                    <div key={item.ID} className="bg-white p-5 rounded-md shadow-md mb-4 duration-300 hover:-translate-y-1">
                            <h2 className="text-xl font-bold">{item.Title}</h2>
                        <p className="truncate text-base pb-4">{item.Description}</p>
                        <p className="text-sm">Start: {formatDate(item.StartedAt)}</p>
                        <p className="text-sm pb-6">Finish: {formatDate(item.FinishedAt)}</p>
                        <div className="flex flex-row justify-between">
                            <div>
                                <Link to={`/view-quiz/${item.ID}`}>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2">
                                        View Quiz
                                    </button>
                                </Link>
                                <Link to={`/edit-quiz/${item.ID}`}>
                                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md mr-2">
                                        Edit Quiz
                                    </button>
                                </Link>
                                <button onClick={() => handleConfirmDelete(item.ID)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">
                                    Delete Quiz
                                 </button>
                            </div>
                            <div>
                            <Link to={`/create-question/${item.ID}`}>
                                <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md mr-2">
                                    Add Question
                                </button>
                            </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 flex justify-center">
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                    Log Out
                </button>
            </div>
        </div>
    );
}
