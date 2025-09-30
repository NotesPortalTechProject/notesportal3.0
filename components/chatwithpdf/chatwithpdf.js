"use client";
import { useState, useRef, useEffect } from "react";
import LoadingDots from "@/components/loadingDots";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";
import { FiArrowLeft, FiArrowUp, FiMic, FiFile } from "react-icons/fi";

export default function ChatWithPdf({ userId }) {
  const [step, setStep] = useState(1);
  const [subjects, setSubjects] = useState([]);
  const [subjectState, setSubjectState] = useState("");
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [errorSubjects, setErrorSubjects] = useState("");

  const [fileList, setFileList] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [errorFiles, setErrorFiles] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [errorAnswer, setErrorAnswer] = useState("");

  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // --- Fetch Functions ---
  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true);
      setErrorSubjects("");
      const res = await fetch(
        `/api/getUserSubjectList?userid=${encodeURIComponent(userId)}`
      );
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
      setErrorFiles("");
      const res = await fetch(
        `/api/getFileNames?subject=${encodeURIComponent(subject)}`
      );
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
      setErrorFiles("");
      const res = await fetch(
        `/api/getFileDataByName?filename=${encodeURIComponent(filename)}`
      );
      const data = await res.json();
      if (res.ok && data.file) {
        setSelectedFile(data.file);
        setAnswer((prev) => [
          ...prev,
          { type: "pdf", file: data.file, filename },
        ]);
      } else setErrorFiles(data.error || "Failed to fetch file");
    } catch (err) {
      setErrorFiles(err.message || "Something went wrong");
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || !selectedFile) return;

    const userQuestion = question;
    setAnswer((prev) => [...prev, { type: "user", text: userQuestion }]);
    setQuestion("");
    textareaRef.current.style.height = "auto";

    try {
      setLoadingAnswer(true);
      setErrorAnswer("");
      const res = await fetch(`/api/pdfchat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filearray: [selectedFile.filelink],
          prompt: userQuestion,
        }),
      });
      const data = await res.json();
      if (res.ok && data.answer) {
        setAnswer((prev) => [...prev, { type: "bot", text: data.answer }]);
      } else setErrorAnswer(data.error || "Failed to get answer");
    } catch (err) {
      setErrorAnswer(err.message || "Something went wrong");
    } finally {
      setLoadingAnswer(false);
    }
  };

  // Scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [answer, loadingAnswer]);

  // --- Classes ---
  const containerClass =
    "p-4 sm:p-6 max-w-7xl h-full mx-auto space-y-6 text-white";
  const buttonClass =
    "bg-purple-700 hover:bg-purple-600 px-4 sm:px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center";
  const backButtonClass =
    "bg-gray-600 hover:bg-gray-700 p-2 rounded-full font-medium transition-all disabled:opacity-50 flex items-center justify-center";

  // Dropdown
  const Dropdown = ({ label, options, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const handleSelect = (option) => {
      onChange(option);
      setOpen(false);
    };
    return (
      <div className="relative w-full">
        <label className="text-white font-semibold mb-2 block">{label}</label>
        <div
          className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center focus-within:ring-2 focus-within:ring-purple-400 transition text-sm sm:text-base"
          onClick={() => setOpen(!open)}
        >
          <span className={`${!value ? "text-gray-400" : "text-white"}`}>
            {value || `--Select--`}
          </span>
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={open ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            />
          </svg>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute z-10 mt-1 w-full bg-black/30 border border-purple-500/30 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.15)] max-h-60 overflow-y-auto hide-scrollbar text-sm sm:text-base"
            >
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 hover:bg-purple-600/40 cursor-pointer text-white transition"
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion(e);
    }
  };

  return (
    <div className={containerClass}>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-300">
        Chat with PDF
      </h1>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          {!subjects.length && !loadingSubjects && (
            <button className={buttonClass} onClick={fetchSubjects}>
              Load My Subjects
            </button>
          )}
          {loadingSubjects && <LoadingDots text="Loading subjects" />}
          {errorSubjects && <p className="text-red-400">{errorSubjects}</p>}

          {subjects.length > 0 && (
            <div className="space-y-3 w-full mt-2">
              <Dropdown
                label="Select Subject:"
                options={subjects}
                value={subjectState}
                onChange={setSubjectState}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  disabled={!subjectState}
                  className={buttonClass}
                  onClick={async () => {
                    await fetchFiles(subjectState);
                    setStep(2);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          {loadingFiles && <LoadingDots text="Loading files..." />}
          {errorFiles && <p className="text-red-400">{errorFiles}</p>}

          {fileList.length > 0 && (
            <div className="space-y-3 w-full mt-2">
              <Dropdown
                label="Select File:"
                options={fileList.map((f) => f.filename)}
                value={selectedFileName}
                onChange={setSelectedFileName}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  disabled={!selectedFileName}
                  className={buttonClass}
                  onClick={async () => {
                    await fetchFileData(selectedFileName);
                    setStep(3);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && selectedFile && (
        <div className="flex flex-col h-[85%] sm:h-[80%] lg:h-[95%]">
          {/* Chat messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 flex flex-col space-y-3 w-full overflow-y-auto hide-scrollbar px-4 sm:px-6"
          >
            {answer.map((item, idx) => {
              const justify =
                item.type === "user" || item.type === "pdf"
                  ? "justify-end"
                  : "justify-start";

              const bgClass =
                item.type === "bot"
                  ? "bg-white/5 border border-white/10"
                  : item.type === "user"
                  ? "bg-purple-700/20 border border-purple-600/30"
                  : "bg-purple-800/20 border border-purple-500/20";

              return (
                <div key={idx} className={`flex ${justify} w-full`}>
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-md break-words lg:max-w-[80%] text-sm md:text-base ${bgClass}`}
                  >
                    {item.type === "bot" ? (
                      <Markdown>{item.text}</Markdown>
                    ) : item.type === "pdf" ? (
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-600/30 p-2 rounded-lg">
                          <FiFile className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                        </div>
                        <span className="text-sm md:text-base font-medium text-purple-200 break-words">
                          {item.filename}
                        </span>
                      </div>
                    ) : (
                      item.text
                    )}
                  </div>
                </div>
              );
            })}
            {loadingAnswer && <LoadingDots text="Getting answer" />}
            {errorAnswer && <p className="text-red-400">{errorAnswer}</p>}
          </div>

          {/* Chat input */}
          <div className="relative w-full flex justify-center mt-2">
            <div className="w-full max-w-3xl relative flex items-center bg-white/5 backdrop-blur-md rounded-3xl px-4 py-2">
              <textarea
                ref={textareaRef}
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  textareaRef.current.style.height = "auto";
                  textareaRef.current.style.height =
                    Math.min(textareaRef.current.scrollHeight, 10 * 24) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask something..."
                data-gramm="false"
                className="flex-1 bg-transparent text-white placeholder:text-gray-400 resize-none overflow-y-auto max-h-[10rem] outline-none leading-[1.5rem] text-sm md:text-base"
                style={{ minHeight: "2rem" }}
              />

              <div className="flex space-x-2 ml-2">
                <button
                  type="button"
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white flex items-center justify-center transition-all duration-200"
                >
                  <FiMic className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  type="submit"
                  onClick={handleAskQuestion}
                  disabled={loadingAnswer || !question.trim()}
                  className={`bg-purple-700 hover:bg-purple-600 p-2 rounded-full text-white flex items-center justify-center transition-all duration-200 ${
                    loadingAnswer ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiArrowUp className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
