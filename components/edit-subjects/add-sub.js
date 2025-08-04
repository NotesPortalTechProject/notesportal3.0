"use client";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
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
      <button onClick={() => setIsOpen(true)} type="button">
        <div
          className="cursor-pointer w-full h-40 sm:h-48 max-w-[10rem] sm:max-w-sm flex items-center justify-center text-center text-white font-semibold text-base sm:text-lg relative rounded-2xl overflow-hidden 
          border-dotted border-2 border-purple-500/30 bg-gradient-to-b from-[#1a122d]/60 to-[#1a0a2d]/80 
          backdrop-blur-xl shadow-[0_0_15px_#a855f733] hover:shadow-[0_0_25px_#c084fcaa] 
          transition-all duration-300 ease-in-out hover:scale-105"
        >
          + Add Subject
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 backdrop-blur-md bg-black/30" />

            <motion.div
              className="relative z-10 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl bg-[#130c1c]/90 border border-purple-500/30 rounded-3xl shadow-[0_0_50px_#9333ea55] backdrop-blur-2xl p-6 sm:p-8 mt-10 mb-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Add Subject
                </h2>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setErrorState("");
                  }}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  Close
                </button>
              </div>

              <form className="flex flex-col gap-5 mt-4" action={HandleAddSub}>
                <input
                  name="sub_code"
                  type="text"
                  placeholder="Enter subject name"
                  className="bg-[#1f102d] border border-purple-500/30 text-white placeholder-purple-300 p-3 sm:p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/70 transition text-sm sm:text-base"
                />
                <input type="text" name="id" value={id} readOnly hidden />

                <button
                  type="submit"
                  className="w-full py-3 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold shadow-[0_0_25px_#9333ea55] hover:shadow-[0_0_30px_#c084fcaa] transition-all duration-200 hover:scale-105"
                >
                  Add Subject
                </button>

                {errorstate && (
                  <p className="text-red-500 text-xs sm:text-sm text-center">
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
