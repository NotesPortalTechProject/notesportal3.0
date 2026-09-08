"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { RemoveSubject } from "@/actions/other-actions";

export function useSubjectListState(initialSubjects, id) {
  const [subjects, setSubjects] = useState(initialSubjects);

  const handleRemove = async (subject) => {
    const toastId = toast.loading("removing subject");
    if (subjects.length <= 1) {
      toast.error("You must keep atleast one subject", { id: toastId });
      return;
    }
    const prevSubjects = subjects;
    const updatedSubjects = subjects.filter((s) => s !== subject);
    setSubjects(updatedSubjects);

    try {
      toast.success(`Removed subject: ${subject}`, { id: toastId });
      await RemoveSubject(id, subject);
    } catch (err) {
      console.error(err);
      setSubjects(prevSubjects);
      toast.error(`Failed to remove subject: ${subject}`, { id: toastId });
    }
  };

  return { subjects, setSubjects, handleRemove };
}
