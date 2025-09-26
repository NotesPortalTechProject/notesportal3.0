'use client'
import { useState } from "react";
import FileCardWrapper from "@/components/file-card";
import LoadingDots from "@/components/loadingDots";
import { motion, AnimatePresence } from "framer-motion";

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
  const [answer, setAnswer] = useState('');
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [errorAnswer, setErrorAnswer] = useState('');

  // --- Fetch Logic ---
  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const res = await fetch(`/api/getUserSubjectList?userid=${userId}`);
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
      const res = await fetch(`/api/getFileNames?subject=${subject}`);
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
      const res = await fetch(`/api/getFileDataByName?filename=${encodeURIComponent(filename)}`);
      const data = await res.json();
      if (res.ok) setSelectedFile(data.file || null);
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
      setAnswer('');
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
      if (res.ok && data.answer) setAnswer(data.answer);
      else setErrorAnswer(data.error || "Failed to get answer");
    } catch (err) {
      setErrorAnswer(err.message || "Something went wrong");
    } finally {
      setLoadingAnswer(false);
    }
  };

  // --- UI Classes ---
  const containerClass = "p-6 max-w-6xl mx-auto space-y-8 text-white";
  const cardClass = "bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg space-y-4";
  const inputClass = "w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition";
  const selectClass = "w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition";
  const buttonClass = "bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50";
  const backButtonClass = "bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50";

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
            {loadingSubjects && <LoadingDots text="Loading subjects..." />}
            {errorSubjects && <p className="text-red-400">{errorSubjects}</p>}

            {subjects.length > 0 && (
              <div className="space-y-3">
                <label className="text-white font-semibold">Select Subject:</label>
                <select className={selectClass} value={subjectState} onChange={(e) => setSubjectState(e.target.value)}>
                  <option value="">--Select--</option>
                  {subjects.map((subj, idx) => <option key={idx} value={subj}>{subj}</option>)}
                </select>
                <button
                  disabled={!subjectState}
                  className={buttonClass}
                  onClick={async () => { await fetchFiles(subjectState); setStep(2); }}
                >
                  Next
                </button>
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

            <p className="text-purple-200 font-semibold">Selected Subject: <span className="text-white">{subjectState}</span></p>

            {fileList.length > 0 && (
              <div className="space-y-3">
                <label className="text-white font-semibold">Select File:</label>
                <select className={selectClass} value={selectedFileName} onChange={(e) => setSelectedFileName(e.target.value)}>
                  <option value="">--Select File--</option>
                  {fileList.map((f, idx) => <option key={idx} value={f.filename}>{f.filename}</option>)}
                </select>

                <div className="flex gap-4 justify-end">
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

      {/* STEP 3 - PDF Chat */}
      <AnimatePresence>
        {step === 3 && selectedFile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cardClass}>
            <p className="text-purple-200 font-semibold">Selected Subject: <span className="text-white">{subjectState}</span></p>
            <p className="text-purple-200 font-semibold">Selected File: <span className="text-white">{selectedFileName}</span></p>

            <div className="max-w-5xl">
              <FileCardWrapper file={selectedFile} userid={userId} />
            </div>

            <form onSubmit={handleAskQuestion} className="space-y-3 mt-4">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask something..."
                className={inputClass}
              />
              <button type="submit" className={buttonClass} disabled={loadingAnswer}>
                {loadingAnswer ? <LoadingDots text="Getting answer" /> : "Ask"}
              </button>
            </form>

            {answer && (
              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl text-white max-w-5xl whitespace-pre-wrap mt-3 shadow-md">
                {answer}
              </div>
            )}
            {errorAnswer && <p className="text-red-400">{errorAnswer}</p>}

            <button className={backButtonClass} onClick={() => setStep(2)}>Back</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}