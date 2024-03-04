import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { format, parseISO } from 'date-fns';

export default function DashboardAdmin() {
    const [quiz, setQuiz] = useState([]);
    const [isActiveList, setIsActiveList] = useState(false); // State untuk menentukan apakah sedang menampilkan List Quiz Active

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = isActiveList ? "http://34.125.14.190:8080/api/quiz/is-active" : "http://34.125.14.190:8080/api/quiz/";
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
    }, [isActiveList]); // Fetch data saat isActiveList berubah

    // Fungsi untuk mengubah format tanggal
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const parsedDate = parseISO(dateString);
        return format(parsedDate, "dd MMMM yyyy, HH:mm");
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
            <div className="grid grid-cols-3 gap-4">
                {quiz.map((item) => (
                    <div key={item.ID} className="bg-white p-5 rounded-md shadow-md relative">
                        <h2 className="text-xl font-bold">{item.Title}</h2>
                        <p className="truncate text-base pb-8">{item.Description}</p>
                        <p className="text-sm">Start: {formatDate(item.StartedAt)}</p>
                        <p className="text-sm pb-12">Finish: {formatDate(item.FinishedAt)}</p>
                        <Link to={`/create-question/${item.ID}`} className="absolute bottom-5 right-5">
                            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md">
                                Add Question
                            </button>
                        </Link>
                    </div>
                ))}                   
            </div>
        </div>
    );
}
