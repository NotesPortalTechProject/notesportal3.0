"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import LoadingDots from "../loadingDots";
import {
  FaList,
  FaPlus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

export default function AddSubjectModal({
  id,
  subjectList: initialSubjectList,
  buttonClass = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subjectList, setSubjectList] = useState(
    initialSubjectList || []
  );
  const [subjectCode, setSubjectCode] = useState("");
  const [concept, setConcept] = useState("");
  const [subjectSuggestions, setSubjectSuggestions] =
    useState([]);
  const [subjectError, setSubjectError] = useState("");
  const [subjectSearchError, setSubjectSearchError] =
    useState("");
  const [isSearchingSubjects, setIsSearchingSubjects] =
    useState(false);
  const [showChangeSummary, setShowChangeSummary] =
    useState(false);
  const [changeSummary, setChangeSummary] = useState({
    added: [],
    removed: [],
  });

  const openModal = () => {
    setSubjectList([...(initialSubjectList || [])]);
    setSubjectCode("");
    setConcept("");
    setSubjectSuggestions([]);
    setSubjectError("");
    setSubjectSearchError("");
    setChangeSummary({
      added: [],
      removed: [],
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    if (loading) return;

    setIsOpen(false);
    setSubjectCode("");
    setConcept("");
    setSubjectSuggestions([]);
    setSubjectError("");
    setSubjectSearchError("");
  };

  function addSubject(codeInput = subjectCode) {
    const code = codeInput.trim().toUpperCase();

    if (!code) {
      setSubjectError("Please enter a subject code");
      return;
    }

    if (code.length < 2) {
      setSubjectError(
        "Subject code must have at least 2 characters"
      );
      return;
    }

    if (code.length > 10) {
      setSubjectError(
        "Subject code cannot be greater than 10 characters"
      );
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(code)) {
      setSubjectError(
        "Subject code cannot contain special characters"
      );
      return;
    }

    const alreadyExists = subjectList.some(
      (subject) =>
        subject?.trim().toUpperCase() === code
    );

    if (alreadyExists) {
      setSubjectError("Subject already added");
      return;
    }

    setSubjectList((prev) => [...prev, code]);
    setSubjectCode("");
    setSubjectError("");
  }

  function removeSubject(subToRemove) {
    if (subjectList.length <= 1) {
      setSubjectError(
        "You must keep at least one subject"
      );
      return;
    }

    setSubjectList((prev) =>
      prev.filter(
        (subject) =>
          subject?.trim().toUpperCase() !==
          subToRemove?.trim().toUpperCase()
      )
    );

    setSubjectError("");
  }

  async function findSubjects() {
    try {
      const searchTerm = concept.trim();

      if (!searchTerm) {
        setSubjectSearchError(
          "Please describe the subject first"
        );
        return;
      }

      setSubjectSearchError("");
      setSubjectSuggestions([]);
      setIsSearchingSubjects(true);

      const response = await fetch(
        "/api/smartsearchsubject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchTerm),
        }
      );

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
      } catch {
        throw new Error(
          "Server returned an invalid JSON response"
        );
      }

      if (!Array.isArray(result)) {
        throw new Error(
          "Invalid subject suggestions received"
        );
      }

      setSubjectSuggestions(result);
    } catch (error) {
      console.error("Find subjects error:", error);

      setSubjectSearchError(
        error?.message ||
          "Unable to find matching subjects"
      );
    } finally {
      setIsSearchingSubjects(false);
    }
  }

  async function saveChanges() {
    if (subjectList.length === 0) {
      toast.error("You must have at least one subject");
      return;
    }

    setLoading(true);

    const toastId = toast.loading(
      "Saving subject changes"
    );

    try {
      const ogSubs = (initialSubjectList || []).map(
        (subject) => subject.trim().toUpperCase()
      );

      const updatedSubs = subjectList.map(
        (subject) => subject.trim().toUpperCase()
      );

      const subsToAdd = updatedSubs.filter(
        (subject) => !ogSubs.includes(subject)
      );

      const subsToRemove = ogSubs.filter(
        (subject) => !updatedSubs.includes(subject)
      );

      const response = await fetch(
        "/api/updatesubjects",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            subjects: updatedSubs,
          }),
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid response"
        );
      }

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Failed to update subjects"
        );
      }

      if (result?.success !== true) {
        throw new Error(
          result?.error ||
            "Failed to update subjects"
        );
      }

      if (
        subsToAdd.length === 0 &&
        subsToRemove.length === 0
      ) {
        toast.success("No changes were made", {
          id: toastId,
        });

        setIsOpen(false);
        return;
      }

      toast.success(
        "Subjects updated successfully",
        {
          id: toastId,
        }
      );

      setChangeSummary({
        added: subsToAdd,
        removed: subsToRemove,
      });

      setIsOpen(false);
      setShowChangeSummary(true);
    } catch (error) {
      console.error(
        "Update subjects error:",
        error
      );

      toast.error(
        error?.message ||
          "Failed to update subjects",
        {
          id: toastId,
          duration: 5000,
        }
      );
    } finally {
      setLoading(false);
    }
  }

  const slideVariants = {
    enter: {
      y: 20,
      opacity: 0,
    },
    center: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: 20,
      opacity: 0,
    },
  };

  const inputStyle =
    "w-full rounded-xl border border-purple-500/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-purple-300/45 focus:border-purple-500/25 focus:bg-black/30";

  const labelStyle =
    "mb-2 block text-sm font-semibold text-white";

  const primaryBtnStyle =
    "flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-purple-500 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={`flex items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-6 py-4 font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 ${buttonClass}`}
      >
        <FaPlus />
        Edit Subjects
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >
            <motion.div
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.25,
              }}
              className="relative max-h-[84vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-purple-500/10 bg-black/40 p-5 shadow-2xl backdrop-blur-xl sm:p-6"
            >
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                <FaTimes />
              </button>

              <div className="mb-8 pr-12">
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Edit your subjects
                </h2>

                <p className="mt-1.5 text-sm text-purple-300/45">
                  Add subject codes from your timetable, or
                  find a code using a short description.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1.15fr_0.85fr]">

                <div className="flex flex-col gap-6">

                  <div className="rounded-2xl border border-purple-500/10 bg-black/20 p-5 sm:p-6">
                    <div className="mb-4">
                      <label className={labelStyle}>
                        Subject Code
                      </label>

                      <p className="ml-1 text-xs text-purple-300/45">
                        Enter the code directly from your
                        timetable.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-4 flex items-center text-sm text-purple-400">
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
                              addSubject();
                            }
                          }}
                          className={`${inputStyle} pl-11`}
                          placeholder="e.g. DBMS"
                          disabled={loading}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => addSubject()}
                        disabled={loading}
                        className={`${primaryBtnStyle} whitespace-nowrap sm:px-6`}
                      >
                        <FaPlus className="text-xs" />
                        Add Subject
                      </button>
                    </div>

                    {subjectError && (
                      <p className="ml-1 mt-3 text-xs text-red-400">
                        {subjectError}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-purple-500/10" />

                    <span className="text-xs font-medium text-purple-300/30">
                      OR
                    </span>

                    <div className="h-px flex-1 bg-purple-500/10" />
                  </div>

                  <div className="rounded-2xl border border-purple-500/10 bg-black/20 p-5 sm:p-6">
                    <div className="mb-4">
                      <label className={labelStyle}>
                        Find Subject Code
                      </label>

                      <p className="ml-1 text-xs text-purple-300/45">
                        Describe the subject in a few words
                        and we’ll find matching codes.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-4 flex items-center text-sm text-purple-400">
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
                          className={`${inputStyle} pl-11`}
                          placeholder="e.g. Data structures"
                          disabled={
                            loading ||
                            isSearchingSubjects
                          }
                        />
                      </div>

                      <button
                        type="button"
                        onClick={findSubjects}
                        disabled={
                          loading ||
                          isSearchingSubjects
                        }
                        className={`${primaryBtnStyle} whitespace-nowrap sm:px-6`}
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
                      <p className="ml-1 mt-3 text-xs text-red-400">
                        {subjectSearchError}
                      </p>
                    )}
                  </div>

                  {subjectSuggestions.length > 0 && (
                    <div>
                      <p className="mb-3 ml-1 text-sm text-purple-300/70">
                        Matching subject codes
                      </p>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {subjectSuggestions.map(
                          (suggestion, index) => {
                            const suggestionCode =
                              typeof suggestion === "string"
                                ? suggestion
                                : suggestion?.subject ||
                                  suggestion?.code ||
                                  "";

                            const alreadyAdded =
                              subjectList.some(
                                (subject) =>
                                  subject
                                    ?.trim()
                                    .toUpperCase() ===
                                  suggestionCode
                                    ?.trim()
                                    .toUpperCase()
                              );

                            return (
                              <div
                                key={`${suggestionCode}-${index}`}
                                className="flex items-center justify-between rounded-xl border border-purple-500/10 bg-[#111]/70 px-4 py-3 transition hover:border-purple-500/25"
                              >
                                <span className="text-sm font-medium text-white">
                                  {suggestionCode}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    addSubject(
                                      suggestionCode
                                    )
                                  }
                                  disabled={
                                    loading ||
                                    alreadyAdded
                                  }
                                  className="text-xs font-medium text-purple-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  {alreadyAdded
                                    ? "Added"
                                    : "Add"}
                                </button>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex min-h-[360px] flex-col rounded-2xl border border-purple-500/10 bg-[#101010]/75 p-5 sm:p-6">
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Your Subjects
                      </h3>

                      <p className="mt-1 text-xs text-purple-300/45">
                        {subjectList.length}{" "}
                        {subjectList.length === 1
                          ? "subject"
                          : "subjects"}{" "}
                        added
                      </p>
                    </div>

                    <div className="rounded-lg border border-purple-500/15 bg-purple-500/10 px-2.5 py-1">
                      <span className="text-xs text-purple-300">
                        {subjectList.length}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 h-px bg-purple-500/10" />

                  {subjectList.length === 0 ? (
                    <div className="flex min-h-[220px] flex-1 items-center justify-center px-6 text-center">
                      <div>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/10 bg-purple-500/[0.06]">
                          <FaList className="text-purple-400/40" />
                        </div>

                        <p className="text-sm leading-relaxed text-purple-300/45">
                          No subjects added yet.
                          <br />
                          Add your first subject to continue.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex max-h-[340px] flex-col gap-2.5 overflow-y-auto pr-1 custom-scrollbar">
                      {subjectList.map(
                        (subject, index) => (
                          <motion.div
                            key={`${subject}-${index}`}
                            initial={{
                              opacity: 0,
                              y: 5,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            className="group flex items-center justify-between rounded-xl border border-purple-500/10 bg-[#181818]/80 px-4 py-3 transition-all hover:border-purple-500/25"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10">
                                <FaList className="text-[10px] text-purple-400/70" />
                              </div>

                              <span className="text-sm font-medium text-white">
                                {subject}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeSubject(subject)
                              }
                              disabled={
                                loading ||
                                subjectList.length <= 1
                              }
                              className="flex items-center gap-1.5 text-xs text-red-400/50 opacity-70 transition hover:text-red-400 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <FaTimes />

                              <span className="hidden sm:inline">
                                Remove
                              </span>
                            </button>
                          </motion.div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-7 flex justify-end border-t border-purple-500/10 pt-5">
                <button
                  type="button"
                  onClick={saveChanges}
                  disabled={loading}
                  className="flex min-w-[160px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:from-purple-500 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <LoadingDots />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChangeSummary && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{
                scale: 0.95,
                y: 15,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                y: 0,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                y: 15,
                opacity: 0,
              }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl border border-white/20 bg-black/50 p-6 shadow-2xl backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold text-white">
                Subjects Updated
              </h2>

              <p className="mt-1 text-sm text-white/60">
                Your subject list has been updated
                successfully.
              </p>

              {changeSummary.added.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-sm font-semibold text-green-400">
                    Subjects Added
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {changeSummary.added.map(
                      (subject, index) => (
                        <span
                          key={`${subject}-${index}`}
                          className="rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-300"
                        >
                          {subject}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {changeSummary.removed.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-sm font-semibold text-red-400">
                    Subjects Removed
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {changeSummary.removed.map(
                      (subject, index) => (
                        <span
                          key={`${subject}-${index}`}
                          className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300"
                        >
                          {subject}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowChangeSummary(false);
                  window.location.reload();
                }}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-3.5 text-sm font-bold text-white transition hover:from-purple-500 hover:to-purple-600"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
