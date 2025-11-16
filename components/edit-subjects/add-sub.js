"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UpdateSubjects } from "@/actions/other-actions";
import toast from "react-hot-toast";
import LoadingDots from "../loadingDots";

export default function AddSubjectModal({ id, onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorstate, setErrorState] = useState("");
  const [loading, setLoading] = useState(false)

  async function HandleAddSub(e) {
    e.preventDefault();
    setErrorState(" ");
    setLoading(true)
    const toastId = toast.loading("adding subject")

    const formData = new FormData(e.target);
    let sub_code;
    const temp_sub_code = formData.get("sub_code").toUpperCase().trim();
    const id = formData.get("id");
    toast.loading("validating",{id:toastId})

    if (!temp_sub_code?.trim()) {
      setLoading(false)
      setErrorState("Subject name cannot be empty");
      return;
    }
    if (!id?.trim()) {
      setLoading(false)
      setErrorState("Try again");
      return;
    }

    if(temp_sub_code=="CAL"||temp_sub_code=="cal"){
      temp_sub_code="CALCULUS";
    }

    sub_code=temp_sub_code
    try {
      toast.loading("adding",{id:toastId})
      await UpdateSubjects(id, sub_code);
      if (onAdd) onAdd(sub_code);
      toast.success("Subject added : "+sub_code,{id:toastId});
      setLoading(false)
      setIsOpen(false);
    } catch (err) {
      setLoading(false)
      console.log(err);
      setErrorState(`Failed to add subject, ${sub_code} might already exist. try again`);
      toast.error("Something went wrong. Please try again.",{id:toastId});
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
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => {
                setIsOpen(false);
                setErrorState("");
              }}
            />

            {/* Modal */}
            <motion.div
              className="
                relative z-50 w-[20rem] sm:w-[22rem] p-5 rounded-2xl 
                backdrop-blur-xl bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a1a3d]/60
                border border-white/5 shadow-[0_0_30px_rgba(168,85,247,0.08)] text-white
              "
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

              <form className="flex flex-col gap-4" onSubmit={HandleAddSub}>
                <p className="text-xs">you can find subject codes in your timetable</p>
                <input
                  name="sub_code"
                  type="text"
                  placeholder="Enter subject name"
                  className="
                    bg-[#1a1a1a]/40 border border-purple-500/10 p-3 text-white
                    placeholder-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm
                  "
                />
                <input type="text" name="id" value={id} readOnly hidden />
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full py-2 text-sm font-semibold rounded-xl text-white
                    bg-gradient-to-r from-purple-600 to-purple-700 shadow-[0_0_20px_#9333ea40]
                    transition-all hover:scale-105
                  "
                >
                  {loading ? <LoadingDots text="please wait" /> : 'Add'}
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
