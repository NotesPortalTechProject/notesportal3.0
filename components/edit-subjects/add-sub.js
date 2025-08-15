"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UpdateSubjects } from "@/actions/other-actions";
import toast from "react-hot-toast";

export default function AddSubjectModal({ id, buttonClass }) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorstate, setErrorState] = useState("");

  async function HandleAddSub(formData) {
    const sub_code = formData.get("sub_code");
    const id = formData.get("id");

    if (!sub_code?.trim()) {
      setErrorState("Subject name cannot be empty");
      return;
    }
    if (!id?.trim()) {
      setErrorState("Try again");
      return;
    }

    try {
      await UpdateSubjects(id, sub_code);
      setIsOpen(false);
      toast.success("Subject added successfully!");
    } catch (err) {
      console.log(err);
      setErrorState("Failed to add subject. Try again.");
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className={`
          w-full h-28 sm:h-32 flex flex-col items-center justify-center 
          rounded-2xl border-2 border-dashed border-white/30
          backdrop-blur-md bg-white/5 text-white font-medium shadow-sm
          transition-all duration-200 hover:bg-white/10 hover:shadow-md hover:scale-[1.03]
          ${buttonClass || ""}
        `}
      >
        <span className="text-4xl sm:text-5xl font-bold text-white">+</span>
        <span className="text-sm font-light text-white/80 mt-1">
          add subject
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => {
                setIsOpen(false);
                setErrorState("");
              }}
            />
            <motion.div
              className="relative z-50 w-[20rem] sm:w-[22rem] p-5 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a1a3d]/60 border border-white/5 shadow-[0_0_30px_rgba(168,85,247,0.08)] text-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-purple-300">
                  Add Subject
                </h2>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setErrorState("");
                  }}
                  className="text-xs font-medium bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg transition"
                >
                  Close
                </button>
              </div>

              <form className="flex flex-col gap-4" action={HandleAddSub}>
                <input
                  name="sub_code"
                  type="text"
                  placeholder="Enter subject name"
                  className="bg-white/5 border border-purple-500/10 p-3 text-white placeholder-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                />
                <input type="text" name="id" value={id} readOnly hidden />
                <button
                  type="submit"
                  className="w-full py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-purple-700 shadow-[0_0_20px_#9333ea40] transition-all hover:scale-105"
                >
                  Add
                </button>
                {errorstate && (
                  <p className="text-red-500 text-xs text-center">
                    {errorstate}
                  </p>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
