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
    "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-purple-400 focus:bg-white/15";

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xl"
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
              className="relative flex max-h-[84vh] w-full max-w-4xl flex-col overflow-y-auto rounded-2xl border border-white/20 bg-black/40 p-5 shadow-2xl backdrop-blur-xl sm:p-6"
            >
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                <FaTimes />
              </button>

              <div className="mb-5 pr-12">
                <h2 className="text-xl font-bold text-white">
                  Edit Subjects
                </h2>

                <p className="mt-1 text-sm text-white/60">
                  Add or remove subjects and save your
                  changes.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-5">
                  <div>
                    <label className={labelStyle}>
                      Add Subject Code
                    </label>

                    <div className="flex gap-2">
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
                        placeholder="e.g. DBMS"
                        className={inputStyle}
                        disabled={loading}
                      />

                      <button
                        type="button"
                        onClick={() => addSubject()}
                        disabled={loading}
                        className={primaryBtnStyle}
                      >
                        <FaPlus />
                        Add
                      </button>
                    </div>

                    {subjectError && (
                      <p className="mt-2 text-xs text-red-400">
                        {subjectError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelStyle}>
                      Find Subject Code
                    </label>

                    <div className="flex gap-2">
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
                        placeholder="Describe a concept..."
                        className={inputStyle}
                        disabled={
                          loading ||
                          isSearchingSubjects
                        }
                      />

                      <button
                        type="button"
                        onClick={findSubjects}
                        disabled={
                          loading ||
                          isSearchingSubjects
                        }
                        className={primaryBtnStyle}
                      >
                        {isSearchingSubjects ? (
                          <LoadingDots />
                        ) : (
                          <>
                            <FaSearch />
                            Find
                          </>
                        )}
                      </button>
                    </div>

                    {subjectSearchError && (
                      <p className="mt-2 text-xs text-red-400">
                        {subjectSearchError}
                      </p>
                    )}
                  </div>

                  {subjectSuggestions.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                        <FaSearch />
                        Suggested Subjects
                      </div>

                      <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-3">
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
                                className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                              >
                                <span className="text-sm font-semibold text-white">
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
                                  className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
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

                <div className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FaList className="text-purple-400" />

                    <h3 className="text-base font-bold text-white">
                      Your Subjects
                    </h3>

                    <span className="ml-auto rounded-full bg-purple-600/30 px-3 py-1 text-xs font-semibold text-purple-200">
                      {subjectList.length}
                    </span>
                  </div>

                  <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
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
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2.5"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600/30 text-xs font-bold text-purple-200">
                              {index + 1}
                            </span>

                            <span className="text-sm font-semibold text-white">
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
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/80 text-xs text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <FaTimes />
                          </button>
                        </motion.div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end border-t border-white/10 pt-5">
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