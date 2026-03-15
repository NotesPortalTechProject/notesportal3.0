"use client";
import ReactMarkdown from "react-markdown";
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
            const cleaneddata = data.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
            setQuestion(cleaneddata);
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
            const cleaneddata = data.replace(/^"|"$/g, "").replace(/\\n/g, "\n");

            if (/yes|correct|right/i.test(data)) {
                setSuccess(cleaneddata);
            } else {
                setError(cleaneddata);
            }
        } catch (err) {
            setError("Could not check answer. Try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full p-6 text-white flex flex-col gap-8">

            <div className="max-w-lg">
                <h1 className="text-3xl font-semibold text-purple-400">
                    QnA Engine
                </h1>
                <p className="mt-1 text-gray-400 text-sm">
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
                    className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-purple-500/40 text-purple-200 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <datalist id="subjects">
                    {subjectList.map((value, idx) => (
                        <option key={idx} value={value} />
                    ))}
                </datalist>

                <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-medium"
                >
                    {loading ? <LoadingDots text=""/>:"Next"}
                </button>
            </div>

            {question && (
                <div className="max-w-3xl p-6 rounded-xl border border-purple-600/40 bg-black/50 shadow-lg">

                    <h2 className="text-xl font-semibold text-purple-300">
                        Question
                    </h2>

                    <div className="whitespace-pre-line mt-3 text-gray-200 leading-relaxed">
                        <ReactMarkdown>{question}</ReactMarkdown>
                    </div>

                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Write your answer here..."
                        rows={4}
                        className="w-full mt-5 p-3 rounded-lg bg-black/50 border border-purple-500/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    <button
                        onClick={handleSubmit}
                        className="mt-4 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition font-medium"
                    >
                        {loading ? <LoadingDots text="checking answer"/>:"Submit"}
                    </button>
                </div>
            )}

            {success && (
                <div className="max-w-3xl p-4 rounded-xl border border-green-500/40 bg-black/40 text-green-300">
                    <div className="whitespace-pre-line">
                        <ReactMarkdown>{success}</ReactMarkdown>
                    </div>
                </div>
            )}

            {error && (
                <div className="max-w-3xl p-4 rounded-xl border border-red-500/40 bg-black/40 text-red-400">
                    <div className="whitespace-pre-line">
                        <ReactMarkdown>{error}</ReactMarkdown>
                    </div>
                </div>
            )}

        </div>
    );
}