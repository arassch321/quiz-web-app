import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { format } from 'date-fns';

export default function CreateQuiz() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startedAt, setstartedAt] = useState("");
    const [finishedAt, setfinishedAt] = useState("");
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formattedstartedAt = format(new Date(startedAt), "yyyy-MM-dd'T'HH:mm:ssxxx");
            const formattedfinishedAt = format(new Date(finishedAt), "yyyy-MM-dd'T'HH:mm:ssxxx");

            const response = await fetch("http://34.125.14.190:8080/api/quiz/created-quiz", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
                },
                body: JSON.stringify({ title, description, startedAt: formattedstartedAt, finishedAt: formattedfinishedAt }),
            });

            if (response.ok) {
                //Tampilkan popup sukses
                navigate("/dashboard-admin");
            }
        }
        catch (error) {
            console.error("An error occurred:", error);
        }
    }

    return (
        <div className="mx-5 px-[15%] pt-24">
            <Header />
            <h1 className="text-3xl font-bold text-center mb-10">Create Quiz</h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 
                        sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Masukkan Judul"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                    <textarea
                        className="bg-gray-50 border border-gray-300 text-gray-900 
                        sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        name="description"
                        id="description"
                        placeholder="Masukkan Deskripsi"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
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
                    />
                </div>
                <div>
                    <label htmlFor="finishedAt" className="block mb-2 text-sm font-medium text-gray-900">End Date</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 
                        sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        type="datetime-local"
                        name="finishedAt"
                        id="finishedAt"
                        value={finishedAt}
                        onChange={(e) => setfinishedAt(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-indigo-500 w-full text-white hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                    Create
                </button>
            </form>
        </div>
    );
}
