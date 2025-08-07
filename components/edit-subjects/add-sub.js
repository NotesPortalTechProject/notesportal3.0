"use client";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";
import { UpdateSubjects } from "@/actions/other-actions";
import toast from "react-hot-toast";

export default function AddSubjectModal({ id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorstate, setErrorState] = useState("");

  async function HandleAddSub(formData) {
    const sub_code = formData.get("sub_code");
    const id = formData.get("id");

    if (!sub_code || sub_code.trim().length === 0) {
      setErrorState("Subject name cannot be empty");
      return;
    }
    if (!id || id.trim().length === 0) {
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
      {/* Trigger Card */}
      <button onClick={() => setIsOpen(true)} type="button">
  <div
    className="w-full max-w-[20rem] h-28 sm:h-32 mb-4
    flex flex-col justify-center px-4 py-3
    rounded-2xl overflow-hidden text-left
    bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a1a3d]/60
    backdrop-blur-xl border border-dotted border-purple-500/30
    shadow-[0_0_0_1px_rgba(168,85,247,0.04),0_0_30px_rgba(168,85,247,0.08)]
    transition-all duration-300 ease-in-out hover:scale-[1.03]"
  >
    <div className="flex items-center gap-3 p-4">
      <div
        className="w-10 h-10 flex items-center justify-center
        rounded-lg bg-white/5 border border-purple-500/20
        shadow-[0_0_8px_rgba(168,85,247,0.15)]
        text-purple-300 text-2xl"
      >
        +
      </div>
      <div>
        <p className="text-purple-300/80 text-base font-semibold">
          Add Subject
        </p>
        <p className="text-sm text-white/50 mt-0.5">
          Create a new subject to begin
        </p>
      </div>
    </div>
  </div>
</button>


      {/* Glassy Modal */}
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
              className="relative z-50 w-[20rem] sm:w-[22rem] p-5 rounded-2xl
              backdrop-blur-xl bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a1a3d]/60
              border border-white/5 shadow-[0_0_30px_rgba(168,85,247,0.08)] text-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
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

              {/* Form */}
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
                  className="w-full py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-purple-700 shadow-[0_0_20px_#9333ea40] hover:shadow-[0_0_25px_#c084fcaa] transition-all hover:scale-105"
                >
                  Add
                </button>

                {errorstate && (
                  <p className="text-red-500 text-xs text-center">{errorstate}</p>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
