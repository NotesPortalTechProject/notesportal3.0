"use client";
import SubjectCard from "../subject-card";
import AddSubjectModal from "../edit-subjects/add-sub";
import { RemoveSubject } from "@/actions/other-actions";
import toast from "react-hot-toast";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function SubjectCards({ subjects, id }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRemove = (subject, id) => {
    startTransition(async () => {
      try {
        await RemoveSubject(id, subject);
        toast.success(`Removed subject: ${subject}`);
        router.refresh(); // 👈 refresh UI to fetch updated subjects
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove subject.");
      }
    });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 sm:p-6">
      {subjects.map((subject, index) => (
        <SubjectCard
          key={index}
          subject={subject}
          id={id}
          onRemove={handleRemove.bind(null, subject, id)}
        />
      ))}
      <AddSubjectModal id={id} />
    </div>
  );
}
