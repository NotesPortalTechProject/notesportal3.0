"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UpdateSubjects } from "@/actions/other-actions";
import toast from "react-hot-toast";
import LoadingDots from "../loadingDots";

export default function AddSubjectModal({ id, onAdd }) {
  const [isOpen, setIsOpen] = useState(false);

  // SUBJECTS
  const [subjects, setSubjects] = useState({});
  const [subjectCode, setSubjectCode] = useState("");
  const [concept, setConcept] = useState("");
  const [subjectSuggestions, setSubjectSuggestions] = useState([]);
  const [subjectError, setSubjectError] = useState("");
  const [subjectSearchError, setSubjectSearchError] = useState("");
  const [isSearchingSubjects, setIsSearchingSubjects] = useState(false);
  const subjectCount = Object.keys(subjects).length;

  function addSubject(codeInput = subjectCode) {
    const code = codeInput.trim().toUpperCase();

    if (!code) {
      setSubjectError("Please enter a subject code");
      return;
    }

    if (code.length < 2) {
      setSubjectError("Subject code must have at least 2 characters");
      return;
    }

    if (code.length > 10) {
      setSubjectError("Subject code cannot be greater than 10 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(code)) {
      setSubjectError("Subject code cannot contain special characters");
      return;
    }

    const alreadyexists = Object.values(subjects).some(
      (i) => i?.toUpperCase() === code
    );

    if (alreadyexists) {
      setSubjectError("Subject already added");
      return;
    }

    setSubjects((prev) => {
      const index = Object.keys(prev).length;

      return {
        ...prev,
        [`subject${index}`]: code,
      };
    });

    setSubjectCode("");
    setSubjectError("");
  }

  function removeSubject(index) {
    setSubjects((prev) => {
      const updated = { ...prev };

      delete updated[`subject${index}`];

      const reindexed = {};

      Object.values(updated).forEach((subject, i) => {
        reindexed[`subject${i}`] = subject;
      });

      return reindexed;
    });
  }

  async function findSubjects() {
    try {
      const searchTerm = concept.trim();
      if (!searchTerm) {
        setSubjectSearchError("Please describe the subject first");
        return;
      }
      setSubjectSearchError("");
      setSubjectSuggestions([]);
      setIsSearchingSubjects(true);
      const response = await fetch("/api/smartsearchsubject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchTerm),
      });
      console.log("API STATUS:", response.status);
      const text = await response.text();
      if (!response.ok) {
        throw new Error(
          `API failed with status ${response.status}: ${text}`
        );
      }
      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        throw new Error("Server returned an invalid JSON response");
      }
      setSubjectSuggestions(result);
    } catch (error) {
      setSubjectSearchError(
        error.message || "Unable to find matching subjects"
      );
    } finally {
      setIsSearchingSubjects(false);
    }
  }

  // old function
  async function HandleAddSub(e) {
    e.preventDefault();
    setErrorState("");
    setLoading(true)
    const toastId = toast.loading("adding subject")

    const formData = new FormData(e.target);
    let sub_code;
    let temp_sub_code = formData.get("sub_code").toUpperCase().trim();
    const id = formData.get("id");
    toast.loading("validating", { id: toastId })

    if (!temp_sub_code?.trim()) {
      setLoading(false)
      setErrorState("Subject name cannot be empty");
      toast.dismiss(toastId)
      return;
    }
    if (!id?.trim()) {
      setLoading(false)
      setErrorState("Try again");
      toast.dismiss(toastId)
      return;
    }

    if (temp_sub_code.length > 10) {
      setLoading(false)
      setErrorState("Length of subject code cannot be greater than 10");
      toast.dismiss(toastId)
      return;
    }

    if (temp_sub_code.length < 2) {
      setLoading(false)
      setErrorState("Subject code must contain atleast 2 letters");
      toast.dismiss(toastId)
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(temp_sub_code)) {
      setLoading(false)
      setErrorState("Subject code cannot contain special characters");
      toast.dismiss(toastId)
      return;
    }

    if (temp_sub_code == "CAL" || temp_sub_code == "cal") {
      temp_sub_code = "CALCULUS";
    }

    sub_code = temp_sub_code
    try {
      toast.loading("adding", { id: toastId })
      await UpdateSubjects(id, sub_code);
      if (onAdd) onAdd(sub_code);
      toast.success("Subject added : " + sub_code, { id: toastId });
      setLoading(false)
      setIsOpen(false);
    } catch (err) {
      setLoading(false)
      console.log(err);
      setErrorState(`Failed to add subject, ${sub_code} might already exist. try again`);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  }

  return (
    <>
      {/* Add Subject Button */}
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="
        w-full h-24 sm:h-28 md:h-40 md:w-full lg:w-full  flex flex-col items-center justify-center
        rounded-2xl border-2 border-dashed border-white/30
        backdrop-blur-md bg-[#1a1a1a]/60 text-white font-medium shadow-sm
        transition-all duration-200 hover:bg-[#1a1a1a]/80 hover:shadow-md hover:scale-[1.03]
      "
      >
        <span className="text-4xl sm:text-5xl font-bold text-white">+</span>
        <span className="text-sm font-light text-white/80 mt-1">
          add subject
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="step4"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Add your subjects
              </h2>

              <p className="text-sm text-purple-300/45 mt-1.5">
                Add subject codes from your timetable, or
                find a code using a short description.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-7">

              {/* LEFT */}
              <div className="flex flex-col gap-6">

                {/* Direct Code */}
                <div className="rounded-2xl bg-black/20 border border-purple-500/10 p-5 sm:p-6">
                  <div className="mb-4">
                    <label className={labelStyle}>
                      Subject Code
                    </label>

                    <p className="text-xs text-purple-300/45 ml-1">
                      Enter the code directly from your
                      timetable.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-4 flex items-center text-purple-400 text-sm">
                        <FaList />
                      </span>

                      <input
                        type="text"
                        value={subjectCode}
                        onChange={(e) => {
                          setSubjectCode(e.target.value);
                          setSubjectError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSubject(subjectCode);
                          }
                        }}
                        className={inputStyle}
                        placeholder="e.g. DBMS"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addSubject(subjectCode)
                      }}
                      className={`${primaryBtnStyle} sm:px-6 whitespace-nowrap`}
                    >
                      <FaPlus className="text-xs" />
                      Add Subject
                    </button>
                  </div>

                  {subjectError && (
                    <p className="text-red-400 text-xs mt-3 ml-1">
                      {subjectError}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="h-px bg-purple-500/10 flex-1" />

                  <span className="text-xs font-medium text-purple-300/30">
                    OR
                  </span>

                  <div className="h-px bg-purple-500/10 flex-1" />
                </div>

                {/* Search */}
                <div className="rounded-2xl bg-black/20 border border-purple-500/10 p-5 sm:p-6">
                  <div className="mb-4">
                    <label className={labelStyle}>
                      Find Subject Code
                    </label>

                    <p className="text-xs text-purple-300/45 ml-1">
                      Describe the subject in a few words
                      and we’ll find matching codes.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-4 flex items-center text-purple-400 text-sm">
                        <FaSearch />
                      </span>

                      <input
                        type="text"
                        value={concept}
                        onChange={(e) => {
                          setConcept(e.target.value);
                          setSubjectSearchError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            findSubjects();
                          }
                        }}
                        className={inputStyle}
                        placeholder="e.g. Data structures"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={findSubjects}
                      disabled={isSearchingSubjects}
                      className={`${primaryBtnStyle} sm:px-6 whitespace-nowrap disabled:opacity-60`}
                    >
                      {isSearchingSubjects ? (
                        <LoadingDots />
                      ) : (
                        <>
                          <FaSearch className="text-xs" />
                          Find
                        </>
                      )}
                    </button>
                  </div>

                  {subjectSearchError && (
                    <p className="text-red-400 text-xs mt-3 ml-1">
                      {subjectSearchError}
                    </p>
                  )}
                </div>

                {/* Suggestions */}
                {subjectSuggestions.length > 0 && (
                  <div>
                    <p className="text-sm text-purple-300/70 mb-3 ml-1">
                      Matching subject codes
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {subjectSuggestions.map(
                        (code, index) => (
                          <div
                            key={`${code}-${index}`}
                            className="flex items-center justify-between bg-[#111]/70 border border-purple-500/10 rounded-xl px-4 py-3 hover:border-purple-500/25 transition"
                          >
                            <span className="text-sm text-white font-medium">
                              {code}
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                addSubject(code)
                              }}
                              className="text-xs text-purple-300 hover:text-white transition font-medium"
                            >
                              Add
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT - SUBJECT LIST */}
              <div className="rounded-2xl bg-[#101010]/75 border border-purple-500/10 p-5 sm:p-6 min-h-[360px] flex flex-col">

                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Your Subjects
                    </h3>

                    <p className="text-xs text-purple-300/45 mt-1">
                      {subjectCount}{" "}
                      {subjectCount === 1
                        ? "subject"
                        : "subjects"}{" "}
                      added
                    </p>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/15">
                    <span className="text-xs text-purple-300">
                      {subjectCount}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-purple-500/10 mb-4" />

                {subjectCount === 0 ? (
                  <div className="flex-1 min-h-[220px] flex items-center justify-center text-center px-6">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-purple-500/[0.06] border border-purple-500/10 flex items-center justify-center mx-auto mb-4">
                        <FaList className="text-purple-400/40" />
                      </div>

                      <p className="text-sm text-purple-300/45 leading-relaxed">
                        No subjects added yet.
                        <br />
                        Add your first subject to continue.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                    {Object.entries(subjects).map(
                      ([key, subject]) => {
                        const index = key.replace(
                          "subject",
                          ""
                        );

                        return (
                          <div
                            key={key}
                            className="group flex items-center justify-between bg-[#181818]/80 border border-purple-500/10 rounded-xl px-4 py-3 hover:border-purple-500/25 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <FaList className="text-purple-400/70 text-[10px]" />
                              </div>

                              <span className="text-sm text-white font-medium">
                                {subject}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeSubject(index)
                              }
                              className="text-xs text-red-400/50 hover:text-red-400 transition flex items-center gap-1.5 opacity-70 group-hover:opacity-100"
                            >
                              <FaTimes />
                              <span className="hidden sm:inline">
                                Remove
                              </span>
                            </button>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
