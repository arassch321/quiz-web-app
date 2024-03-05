import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { format } from 'date-fns';
import Swal from "sweetalert2";

export default function EditQuiz() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startedAt, setstartedAt] = useState("");
    const [finishedAt, setfinishedAt] = useState("");
    const navigate = useNavigate();
    const { IDQuiz } = useParams();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`http://api-quiz-arras.my.id:8080/api/quiz/${IDQuiz}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setTitle(data.payload.Title);
                    setDescription(data.payload.Description);
                    setstartedAt(format(new Date(data.payload.StartedAt), "yyyy-MM-dd'T'HH:mm"));
                    setfinishedAt(format(new Date(data.payload.FinishedAt), "yyyy-MM-dd'T'HH:mm"));

                    
                } else {
                    console.error("Failed to fetch quiz:", response.statusText);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to fetch quiz data!',
                    });
                }
            } catch (error) {
                console.error("Error fetching quiz data:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred!',
                });
            }
        };

        fetchQuiz();
    }, [IDQuiz]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to update this quiz?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!'
        });

        if (confirmation.isConfirmed) {
            try {
                const formattedStartedAt = format(new Date(startedAt), "yyyy-MM-dd'T'HH:mm:ssxxx");
                const formattedFinishedAt = format(new Date(finishedAt), "yyyy-MM-dd'T'HH:mm:ssxxx");

                const response = await fetch(`http://api-quiz-arras.my.id:8080/api/quiz/updated-quiz/${IDQuiz}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
                    },
                    body: JSON.stringify({ title, description, startedAt: formattedStartedAt, finishedAt: formattedFinishedAt }),
                });

                if (response.ok) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Quiz updated successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate("/dashboard-admin");
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to update quiz!',
                    });
                }
            } catch (error) {
                console.error("An error occurred:", error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred!',
                });
            }
        }
    };

    return (
        <div className="mx-5 px-[15%] pt-24">
            <Header />
            <h1 className="text-3xl font-bold text-center mb-10">Edit Quiz</h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 
                        sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Enter Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                    <textarea
                        className="bg-gray-50 border border-gray-300 text-gray-900 
                        sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        name="description"
                        id="description"
                        placeholder="Enter Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="flex justify-start">
                    <div>
                        <label htmlFor="startedAt" className="block mb-2 text-sm font-medium text-gray-900">Start Date</label>
                        <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 
                            sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            type="datetime-local"
                            name="startedAt"
                            id="startedAt"
                            value={startedAt}
                            onChange={(e) => setstartedAt(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mx-5">
                        <label htmlFor="finishedAt" className="block mb-2 text-sm font-medium text-gray-900">End Date</label>
                        <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 
                            sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            type="datetime-local"
                            name="finishedAt"
                            id="finishedAt"
                            value={finishedAt}
                            onChange={(e) => setfinishedAt(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-indigo-500 w-full text-white hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                    Update
                </button>
            </form>
        </div>
    );
}
