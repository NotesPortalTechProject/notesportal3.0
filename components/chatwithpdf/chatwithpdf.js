'use client'
import { useState } from "react";
import LoadingDots from "@/components/loadingDots";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";

export default function ChatWithPdf({ userId }) {
  const [step, setStep] = useState(1);
  const [subjects, setSubjects] = useState([]);
  const [subjectState, setSubjectState] = useState('');
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [errorSubjects, setErrorSubjects] = useState('');

  const [fileList, setFileList] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [errorFiles, setErrorFiles] = useState('');

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState([]);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [errorAnswer, setErrorAnswer] = useState('');

  // --- Fetch Logic ---
  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true);
      setErrorSubjects('');
      const res = await fetch(`/api/getUserSubjectList?userid=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (res.ok) setSubjects(data.subjects || []);
      else setErrorSubjects(data.error || "Failed to fetch subjects");
    } catch (err) {
      setErrorSubjects(err.message || "Something went wrong");
    } finally {
      setLoadingSubjects(false);
    }
  };

  const fetchFiles = async (subject) => {
    try {
      setLoadingFiles(true);
      setErrorFiles('');
      const res = await fetch(`/api/getFileNames?subject=${encodeURIComponent(subject)}`);
      const data = await res.json();
      if (res.ok) setFileList(data.files || []);
      else setErrorFiles(data.error || "Failed to fetch files");
    } catch (err) {
      setErrorFiles(err.message || "Something went wrong");
    } finally {
      setLoadingFiles(false);
    }
  };

  const fetchFileData = async (filename) => {
    try {
      setErrorFiles('');
      const res = await fetch(`/api/getFileDataByName?filename=${encodeURIComponent(filename)}`);
      const data = await res.json();
      if (res.ok && data.file) setSelectedFile(data.file);
      else setErrorFiles(data.error || "Failed to fetch file");
    } catch (err) {
      setErrorFiles(err.message || "Something went wrong");
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || !selectedFile) return;

    try {
      setLoadingAnswer(true);
      setErrorAnswer('');
      const res = await fetch(`/api/pdfchat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filearray: [selectedFile.filelink],
          prompt: question
        })
      });
      const data = await res.json();
      if (res.ok && data.answer) setAnswer(prev => [...prev, { question, answer: data.answer }]);
      else setErrorAnswer(data.error || "Failed to get answer");
    } catch (err) {
      setErrorAnswer(err.message || "Something went wrong");
    } finally {
      setLoadingAnswer(false);
      setQuestion('');
    }
  };

  // --- Classes ---
  const containerClass = "p-6 max-w-7xl h-full mx-auto space-y-6 text-white";
  const cardClass = "bg-gradient-to-br from-[#1a1a1a]/90 via-[#2a1a3d]/70 to-[#3d1f5e]/60 border border-purple-500/20 rounded-2xl h-fit p-4 shadow-[0_0_20px_rgba(168,85,247,0.15)]";
  const inputClass = "w-full bg-white/5 border border-purple-500/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition";
  const buttonClass = "bg-purple-700 hover:bg-purple-600 px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50";
  const backButtonClass = "bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50";
  const fileBoxClass = "bg-purple-700/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white font-medium shadow-md";

  // --- NotesPortal-style dropdown ---
  const Dropdown = ({ label, options, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const handleSelect = (option) => {
      onChange(option);
      setOpen(false);
    };
    return (
      <div className="relative w-full">
        <label className="text-white font-semibold">{label}</label>
        <div
          className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center focus-within:ring-2 focus-within:ring-purple-400 transition"
          onClick={() => setOpen(!open)}
        >
          <span className={`${!value ? "text-gray-400" : "text-white"}`}>{value || `--Select--`}</span>
          <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
          </svg>
        </div>
        {open && (
          <div className="absolute z-10 mt-1 w-full bg-black/90 border border-purple-500/30 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.15)] max-h-60 overflow-y-auto hide-scrollbar">
            {options.map((opt, idx) => (
              <div
                key={idx}
                className="px-4 py-3 hover:bg-purple-600/40 cursor-pointer text-white transition"
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={containerClass}>
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl font-extrabold text-purple-300">
        Chat with PDF
      </motion.h1>

      {/* STEP 1 - Subject Selection */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cardClass}>
            {!subjects.length && !loadingSubjects && (
              <button className={buttonClass} onClick={fetchSubjects}>
                Load My Subjects
              </button>
            )}
            {loadingSubjects && <LoadingDots text="Loading subjects" />}
            {errorSubjects && <p className="text-red-400">{errorSubjects}</p>}

            {subjects.length > 0 && (
              <div className="space-y-3 w-full">
                <Dropdown
                  label="Select Subject:"
                  options={subjects}
                  value={subjectState}
                  onChange={(val) => setSubjectState(val)}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    disabled={!subjectState}
                    className={buttonClass}
                    onClick={async () => { await fetchFiles(subjectState); setStep(2); }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 2 - File Selection */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cardClass}>
            {loadingFiles && <LoadingDots text="Loading files..." />}
            {errorFiles && <p className="text-red-400">{errorFiles}</p>}

            {fileList.length > 0 && (
              <div className="space-y-3 w-full">
                <Dropdown
                  label="Select File:"
                  options={fileList.map(f => f.filename)}
                  value={selectedFileName}
                  onChange={(val) => setSelectedFileName(val)}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    disabled={!selectedFileName}
                    className={buttonClass}
                    onClick={async () => { await fetchFileData(selectedFileName); setStep(3); }}
                  >
                    Next
                  </button>
                  <button className={backButtonClass} onClick={() => setStep(1)}>Back</button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 3 - Chat */}
      <AnimatePresence>
        {step === 3 && selectedFile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cardClass}>
            {/* File Box */}
            <div className={`w-full ${fileBoxClass} mb-4`}>
              {selectedFileName}
            </div>

            {/* Chat */}
            <div className="flex flex-col space-y-3 w-full lg:max-h-[55vh] overflow-y-auto hide-scrollbar">
              {answer.map((item, idx) => (
                <div key={idx} className="space-y-1 w-full">
                  <div className="bg-purple-700/20 px-4 py-2 rounded-xl text-white font-medium shadow-sm w-full">{item.question}</div>

                  <div className="bg-white/5 px-4 py-2 rounded-xl text-white shadow-inner whitespace-pre-wrap w-full"><Markdown>{item.answer}</Markdown></div>
                </div>
              ))}
              {loadingAnswer && <LoadingDots text="Getting answer..." />}
              {errorAnswer && <p className="text-red-400">{errorAnswer}</p>}
            </div>

            {/* Input */}
            <form onSubmit={handleAskQuestion} className="mt-4 flex gap-2 w-full">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask something..."
                className={`flex-1 ${inputClass}`}
              />
              <button type="submit" className={buttonClass} disabled={loadingAnswer}>
                Ask
              </button>
              <button type="button" className={backButtonClass} onClick={() => setStep(2)}>Back</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
