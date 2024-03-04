import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";

export default function ViewQuiz() {
    const [quiz, setQuiz] = useState([]);
    const navigate = useNavigate();
    const { IDQuiz } = useParams();

    useEffect(() => {
        const getQuiz = async () => {
            try {
                const response = await fetch(`http://34.125.14.190:8080/api/question/questions/${IDQuiz}`, {
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

    return (
        <div className="mx-5 px-[15%] pt-24">
            <Header />
            <h1 className="text-3xl font-bold text-center mb-10">List Question</h1>
            <div className="grid grid-cols-3 gap-4">
                {quiz.map((item, index) => {
                    const options = JSON.parse(item.Options); // Parse string JSON menjadi objek
                    return (
                        <div key={index} className="bg-white p-5 shadow-md rounded-md">
                            <h1 className="text-xl font-bold mb-5">{item.Question}</h1>
                            <div className="flex justify-between">
                                <p className="text-lg">A. {options.A}</p>
                                <p className="text-lg">B. {options.B}</p>
                                <p className="text-lg">C. {options.C}</p>
                                <p className="text-lg">D. {options.D}</p>
                            </div>
                            <p className="text-lg font-bold mt-5">True Answer: {item.TrueAnswer}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
