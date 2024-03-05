import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Swal from 'sweetalert2';

export default function ViewQuiz() {
    const [quiz, setQuiz] = useState([]);
    const navigate = useNavigate();
    const { IDQuiz } = useParams();

    useEffect(() => {
        const getQuiz = async () => {
            try {
                const response = await fetch(`http://api-quiz-arras.my.id:8080/api/question/questions/${IDQuiz}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setQuiz(data.questions);
                } else {
                    console.error("Failed to fetch quiz data:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching quiz data:", error);
            }
        };

        getQuiz();
    }, [IDQuiz]);

    const handleDeleteQuestion = async (id) => {
        try {
            const response = await fetch(`http://api-quiz-arras.my.id:8080/api/question/${id}`, {
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
                    title: 'Question deleted successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                console.error("Failed to delete question:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting question:", error);
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
                handleDeleteQuestion(id);
            }
        });
    };

    return (
        <div className="mx-5 px-[15%] pt-24">
            <Header />
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-3xl font-bold text-center">List Question</h1>
                <button onClick={() => navigate(`/create-question/${IDQuiz}`)} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    Add Question
                </button>
            </div>
            {quiz.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {quiz.map((item, index) => {
                        const options = JSON.parse(item.Options); // Parse string JSON menjadi objek
                        const questionNumber = index + 1;
                        return (
                            <div key={index} className="bg-white p-5 shadow-md rounded-md mb-5 relative">
                                <h1 className="text-xl font-bold mb-5">{questionNumber}. {item.Question}</h1>
                                <div className="grid grid-cols-2 gap-2">
                                    <p className="text-lg">A. {options.A}</p>
                                    <p className="text-lg">B. {options.B}</p>
                                    <p className="text-lg">C. {options.C}</p>
                                    <p className="text-lg">D. {options.D}</p>
                                </div>
                                <p className="text-lg font-bold mt-5">True Answer: {item.TrueAnswer}</p>
                                <button onClick={() => handleConfirmDelete(item.ID)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md mt-2 absolute bottom-3 right-3">
                                    Delete Question
                                </button>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-lg font-medium">Tidak ada Question yang tersedia untuk kuis ini</p>
                    <button className="my-5 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={() => navigate(`/create-question/${IDQuiz}`)}>
                        Add Question
                    </button>
                </div>
            )}
        </div>
    )
}
