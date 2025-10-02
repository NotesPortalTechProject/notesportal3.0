"use client";
import { useState, useRef, useEffect } from "react";
import LoadingDots from "@/components/loadingDots";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";
import { FiArrowUp, FiMic, FiFile, FiPlus, FiCheck, FiX } from "react-icons/fi";

export default function ChatWithPdf({ userId, subjectList }) {
  const [step, setStep] = useState(1);
  const [subjectState, setSubjectState] = useState("");
  const [fileList, setFileList] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [errorFiles, setErrorFiles] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [errorAnswer, setErrorAnswer] = useState("");
  const [showFilePicker, setShowFilePicker] = useState(false);

  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const pickerRef = useRef(null);

  // Close picker on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowFilePicker(false);
      }
    }
    if (showFilePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilePicker]);

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
        setSelectedFiles((prev) => {
          if (prev.find((f) => f.filename === filename)) return prev;
          return [...prev, { filename, file: data.file }];
        });
        setAnswer((prev) => [
          ...prev,
          { type: "pdf", filename, file: data.file },
        ]);
      } else setErrorFiles(data.error || "Failed to fetch file");
    } catch (err) {
      setErrorFiles(err.message || "Something went wrong");
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || selectedFiles.length === 0) return;

    const userQuestion = question;
    setAnswer((prev) => [...prev, { type: "user", text: userQuestion }]);
    setQuestion("");
    textareaRef.current.style.height = "auto";

    try {
      setLoadingAnswer(true);
      setErrorAnswer("");
      const fileLinks = selectedFiles.map((f) => f.file.filelink);
      const res = await fetch(`/api/pdfchat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filearray: fileLinks, prompt: userQuestion }),
      });
      const data = await res.json();
      if (res.ok && data.answer) {
        setAnswer((prev) => [...prev, { type: "bot", text: data.answer }]);
      } else {
        setAnswer((prev) => [
          ...prev,
          { type: "bot", text: " Failed to fetch answer." },
        ]);
      }
    } catch (err) {
      setAnswer((prev) => [
        ...prev,
        {
          type: "bot",
          text: " Error: " + (err.message || "Something went wrong"),
        },
      ]);
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

  const containerClass =
    "p-3 sm:p-5 max-w-7xl h-full mx-auto space-y-6 text-white";
  const buttonClass =
    "bg-purple-700 hover:bg-purple-600 px-4 sm:px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center";

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
      <div className="flex flex-col items-start">
        <h1 className="text-lg sm:text-xl font-bold text-purple-300">
          Chat with PDF
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Select one or more files and ask questions. We will answer based on
          the files provided.
        </p>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-3 w-full mt-2">
          <Dropdown
            label="Select Subject:"
            options={subjectList}
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

      {/* STEP 2 */}
      {step === 2 && (
        <>
          {loadingFiles && <LoadingDots text="Loading files..." />}
          {errorFiles && (
            <div className="border border-red-500/50 rounded-md p-3 text-red-400 text-sm">
              {errorFiles}
            </div>
          )}
          {fileList.length > 0 && (
            <div className="space-y-3 w-full mt-2">
              <Dropdown
                label="Select File(s):"
                options={fileList.map((f) => f.filename)}
                value=""
                onChange={(filename) => fetchFileData(filename)}
              />

              {/* Selected files display */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedFiles.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center bg-purple-700/20 border border-purple-500/30 rounded-lg px-3 py-1 text-sm text-purple-200"
                    >
                      <FiFile className="mr-1 text-purple-300" />
                      {f.filename}
                      <button
                        onClick={() =>
                          setSelectedFiles(
                            selectedFiles.filter(
                              (sf) => sf.filename !== f.filename
                            )
                          )
                        }
                        className="ml-2 text-red-400 hover:text-red-300"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  disabled={selectedFiles.length === 0}
                  className={buttonClass}
                  onClick={() => setStep(3)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && selectedFiles.length > 0 && (
        <div
          className="flex flex-col
                h-[75%]     /* base / xs */
                sm:h-[72%]  /* ≥640px */
                md:h-[75%]  /* ≥768px */
                lg:h-[90%]  /* ≥1024px */
                xl:h-[90%]  /* ≥1280px */
                2xl:h-[90%] /* ≥1536px */
                relative"
        >
          {/* Messages */}
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
          </div>

          {/* Input */}
          <div className="relative w-full flex justify-center mt-2">
            <div className="w-full max-w-3xl relative" ref={pickerRef}>
              <div className="flex items-end bg-white/5 backdrop-blur-md rounded-3xl px-3 sm:px-4 py-2 w-full max-w-3xl">
                {/* Plus Button */}
                <button
                  type="button"
                  className="mr-2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  onClick={() => setShowFilePicker(true)}
                >
                  <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Textarea */}
                <div className="flex-1 flex items-end min-w-0">
                  <textarea
                    ref={textareaRef}
                    value={question}
                    onChange={(e) => {
                      setQuestion(e.target.value);
                      textareaRef.current.style.height = "auto";
                      const maxHeight = 5 * 24;
                      textareaRef.current.style.height = `${Math.min(
                        textareaRef.current.scrollHeight,
                        maxHeight
                      )}px`;
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask something..."
                    className="flex-1 bg-transparent text-white placeholder:text-gray-400 resize-none outline-none text-sm md:text-base hide-scrollbar min-w-0"
                    style={{
                      minHeight: "2.5rem",
                      lineHeight: "1.5rem",
                      overflow: "hidden",
                      paddingTop: "0.5rem",
                      paddingBottom: "0.5rem",
                    }}
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-1 sm:space-x-2 ml-2 flex-shrink-0">
                  <button className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white flex items-center justify-center transition-all duration-200">
                    <FiMic className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    type="submit"
                    onClick={handleAskQuestion}
                    disabled={loadingAnswer || !question.trim()}
                    className={`bg-purple-700 hover:bg-purple-600 p-2 rounded-full text-white flex items-center justify-center transition-all duration-200 ${
                      loadingAnswer ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FiArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* File Picker */}
              {showFilePicker && (
                <div className="absolute bottom-full left-0 mb-2 w-64 max-h-60 overflow-y-auto bg-[#1a1a1a] border border-purple-500/30 rounded-xl shadow-lg z-20">
                  {fileList.length > 0 ? (
                    fileList.map((f, idx) => {
                      const alreadySelected = selectedFiles.some(
                        (sf) => sf.filename === f.filename
                      );
                      return (
                        <div
                          key={idx}
                          className={`flex m-1 items-center justify-between px-3 py-2 cursor-pointer text-sm transition rounded-md ${
                            alreadySelected
                              ? "bg-purple-600/30 text-purple-200"
                              : "hover:bg-white/10 text-white"
                          }`}
                          onClick={async () => {
                            if (!alreadySelected) {
                              await fetchFileData(f.filename);
                            } else {
                              setSelectedFiles(
                                selectedFiles.filter(
                                  (sf) => sf.filename !== f.filename
                                )
                              );
                            }
                            setShowFilePicker(false);
                          }}
                        >
                          <span className="truncate">{f.filename}</span>
                          {alreadySelected && (
                            <FiCheck className="text-purple-400" />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-400">
                      No files found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
