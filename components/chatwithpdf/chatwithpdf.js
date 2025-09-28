"use client";
import { useState, useRef, useEffect } from "react";
import LoadingDots from "@/components/loadingDots";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";
import { FiArrowLeft, FiArrowUp, FiMic } from "react-icons/fi";

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
  const cardClass =
    "bg-gradient-to-br from-[#1a1a1a]/90 via-[#2a1a3d]/70 to-[#3d1f5e]/60 border border-purple-500/20 rounded-2xl p-4 shadow-[0_0_20px_rgba(168,85,247,0.15)] flex flex-col";
  const buttonClass =
    "bg-purple-700 hover:bg-purple-600 px-4 sm:px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center";
  const backButtonClass =
    "bg-gray-600 hover:bg-gray-700 p-2 rounded-full font-medium transition-all disabled:opacity-50 flex items-center justify-center";
  const inputClass =
    "flex-1 bg-white/5 text-white placeholder:text-gray-400 resize-none overflow-y-auto max-h-[10rem] rounded-3xl px-4 py-2 pr-24 hide-scrollbar leading-[1.5rem] box-border transition-all duration-200 ease-in-out";

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
              transition={{ duration: 0.2 }}
              className="absolute z-10 mt-1 w-full bg-black/90 border border-purple-500/30 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.15)] max-h-60 overflow-y-auto hide-scrollbar text-sm sm:text-base"
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
        <div className={cardClass}>
          <div className="flex items-center justify-start mb-2">
            <button className={backButtonClass} disabled>
              <FiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

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
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className={cardClass}>
          <div className="flex items-center justify-start mb-2">
            <button className={backButtonClass} onClick={() => setStep(1)}>
              <FiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

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
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && selectedFile && (
        <div className={cardClass}>
          {/* Chat messages */}
          <div
            ref={chatContainerRef}
            className="flex flex-col space-y-3 w-full max-h-[49vh] sm:max-h-[43vh] md:max-h-[43vh] lg:max-h-[50vh] xl:max-h-[58vh] overflow-y-auto hide-scrollbar mb-4"
          >
            {answer.map((item, idx) => {
              const justify =
                item.type === "user" || item.type === "pdf"
                  ? "justify-end"
                  : "justify-start";

              const maxWidthClass =
                item.type === "bot"
                  ? "max-w-[90%] sm:max-w-[60%]"
                  : "max-w-[80%] sm:max-w-[55%]";

              const bubbleClass =
                item.type === "bot"
                  ? `bg-white/5 px-4 py-2 rounded-2xl shadow-inner break-words ${maxWidthClass} min-w-[20%] text-base sm:text-sm`
                  : `bg-purple-700/40 px-4 py-2 rounded-2xl shadow-md break-words ${maxWidthClass} min-w-[20%] text-base sm:text-sm`;

              return (
                <div key={idx} className={`flex ${justify}`}>
                  {item.type === "bot" ? (
                    <div className={bubbleClass}>
                      <Markdown>{item.text}</Markdown>
                    </div>
                  ) : (
                    <div className={bubbleClass}>
                      {item.text || item.filename}
                    </div>
                  )}
                </div>
              );
            })}
            {loadingAnswer && <LoadingDots text="Getting answer" />}
            {errorAnswer && <p className="text-red-400">{errorAnswer}</p>}
          </div>

          {/* Chat input */}
          <div className="relative w-full flex flex-col-reverse max-w-2xl mx-auto">
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
              className="flex-1 bg-white/5 text-white placeholder:text-gray-400 resize-none overflow-y-auto max-h-[10rem] rounded-3xl px-4 py-3 pr-22 hide-scrollbar leading-[1.5rem] box-border transition-all duration-200 ease-in-out text-sm md:text-base"
              style={{ minHeight: "2rem" }}
            />

            <div className="absolute right-3 bottom-3 flex space-x-2">
              <button
                type="button"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white flex items-center justify-center transition-all duration-200"
              >
                <FiMic className="w-5 h-5 md:w-4 md:h-4" />
              </button>
              <button
                type="submit"
                onClick={handleAskQuestion}
                disabled={loadingAnswer || !question.trim()}
                className={`bg-purple-700 hover:bg-purple-600 p-2 rounded-full text-white flex items-center justify-center transition-all duration-200 ${
                  loadingAnswer ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiArrowUp className="w-5 h-5 md:w-4 md:h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
