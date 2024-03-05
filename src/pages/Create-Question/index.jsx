import React, { useState } from "react";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function CreateQuestion() {
    const [questions, setQuestions] = useState([
        {
            question: "",
            true_answer: "",
            options: {
                A: "",
                B: "",
                C: "",
                D: "",
            },
        },
    ]);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State untuk menampilkan popup sukses
    const { IDQuiz } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://api-quiz-arras.my.id:8080/api/question/created-question/${IDQuiz}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
                },
                body: JSON.stringify(questions),
            });

            if (response.ok) {
                // Tampilkan popup sukses
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Your questions have been successfully saved.',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(`/view-quiz/${IDQuiz}`);
                    }
                });
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                true_answer: "",
                options: {
                    A: "",
                    B: "",
                    C: "",
                    D: "",
                },
            },
        ]);
    };

    const handleDeleteQuestion = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (index, option, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options[option] = value;
        setQuestions(updatedQuestions);
    };

    const handleTrueAnswerChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].true_answer = value;
        setQuestions(updatedQuestions);
    };

    return (
        <div className="mx-5 px-[15%] pt-24">
            <Header />
            <h1 className="text-3xl font-bold text-center mb-10">Create Questions</h1>
            {questions.map((question, index) => (
                <div key={index} className="space-y-4 md:space-y-6 pt-5">
                    <form>
                        <div>
                            <label htmlFor={`question${index}`} className="block mb-2 text-sm font-medium text-gray-900">
                                Question {index + 1}
                            </label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                type="text"
                                name={`question${index}`}
                                id={`question${index}`}
                                placeholder={`Masukkan Pertanyaan ${index + 1}`}
                                value={question.question}
                                onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                                required
                            />
                        </div>
                        {Object.keys(question.options).map((option, optionIndex) => (
                            <div key={optionIndex}>
                                <label
                                    htmlFor={`option${index}${option}`}
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Option {option}
                                </label>
                                <input
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    type="text"
                                    name={`option${index}${option}`}
                                    id={`option${index}${option}`}
                                    placeholder={`Masukkan Pilihan ${option}`}
                                    value={question.options[option]}
                                    onChange={(e) => handleOptionChange(index, option, e.target.value)}
                                    required
                                />
                            </div>
                        ))}
                        <div className="flex items-center">
                            {Object.keys(question.options).map((option) => (
                                <div key={option} className="mr-4">
                                    <input
                                        type="radio"
                                        name={`trueAnswer${index}`}
                                        id={`trueAnswer${index}${option}`}
                                        checked={question.true_answer === option}
                                        onChange={() => handleTrueAnswerChange(index, option)}
                                        required
                                    />
                                    <label
                                        htmlFor={`trueAnswer${index}${option}`}
                                        className="ml-2 text-sm font-medium text-gray-900"
                                    >
                                        True Answer {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
            ))}
            <div className="py-10 flex justify-between">
                <div>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mx-3"
                    onClick={handleAddQuestion}
                >
                    Add List
                </button>
               <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                    onClick={() => handleDeleteQuestion(questions.length - 1)}
                >
                    Delete List
                </button>
                 </div>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                    onClick={handleSubmit}
                >
                    Save Questions
                </button>
            </div>
            {showSuccessPopup && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Success!</h2>
                        <p>Your questions have been successfully saved.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
