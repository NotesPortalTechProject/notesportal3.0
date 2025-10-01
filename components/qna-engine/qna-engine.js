"use client";

import { useState } from "react";
import LoadingDots from "../loadingDots";

export default function QnaEngine({ userid, subjectList }) {
    const [subject, setSubject] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        if (!subject) {
            setError("Please select a subject first");
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");
        setQuestion("");
        setAnswer("");

        try {
            const res = await fetch("/api/askquestion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subjectname: subject }),
            });

            if (!res.ok) throw new Error("Failed to fetch question");
            const data = await res.text();
            setQuestion(data);
        } catch (err) {
            setError("Could not get question. Try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!answer) {
            setError("Please enter an answer");
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/answerquestion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer }),
            });

            if (!res.ok) throw new Error("Failed to check answer");
            
            const data = await res.text();

            if (/yes|correct|right/i.test(data)) {
                setSuccess(data);
            } else {
                setError(data);
            }
        } catch (err) {
            setError("Could not check answer. Try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full p-4 text-white flex flex-col gap-6">
            <div className="max-w-lg">
                <h1 className="text-2xl font-semibold text-purple-300">Qna Engine</h1>
                <p className="mt-1 text-gray-400 text-xs">
                    Select any subject, get questions based on the files present, and prepare for that exam.
                </p>
            </div>

            <div className="flex gap-4 items-center max-w-3xl">
                <input
                    type="text"
                    list="subjects"
                    placeholder="Select subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="px-3 py-2 rounded-md text-black"
                />
                <datalist id="subjects">
                    {subjectList.map((value, idx) => (
                        <option key={idx} value={value} />
                    ))}
                </datalist>
                <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md"
                >
                    Next
                </button>
            </div>

            {loading && <LoadingDots text=""/>}

            {question && (
                <div className="bg-gray-800 p-4 rounded-lg max-w-3xl">
                    <h2 className="text-lg font-semibold">Question:</h2>
                    <p className="mt-2">{question}</p>

                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Write your answer here..."
                        className="w-full mt-3 p-2 rounded-md text-black"
                        rows={4}
                    />

                    <button
                        onClick={handleSubmit}
                        className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"
                    >
                        Submit
                    </button>
                </div>
            )}

            {success && (
                <div className="border border-green-500/50 rounded-md p-3 text-green-400 text-sm max-w-3xl">
                    {success}
                </div>
            )}

            {error && (
                <div className="border border-red-500/50 rounded-md p-3 text-red-400 text-sm max-w-3xl">
                    {error}
                </div>
            )}
        </div>
    );
}
