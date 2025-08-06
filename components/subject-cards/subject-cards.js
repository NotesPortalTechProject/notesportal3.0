"use client";
import SubjectCard from "../subject-card";
import AddSubjectModal from "../edit-subjects/add-sub";
import { RemoveSubject } from "@/actions/other-actions";
import toast from "react-hot-toast";
import { useTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Carousel = dynamic(() => import("../effects/carousel"), { ssr: false });

export default function SubjectCards({ subjects, id }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRemove = (subject) => {
    startTransition(async () => {
      try {
        await RemoveSubject(id, subject);
        toast.success(`Removed subject: ${subject}`);
        router.refresh();
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove subject.");
      }
    });
  };

  // Prepare carousel items no matter what (hooks are above this)
  const carouselItems = subjects.map((subject, index) => ({
    title: subject,
    description: "Click to view or remove subject",
    id: index,
    icon: <span className="text-xs text-white font-bold">{subject[0]}</span>,
    href: `/${id}/subject/${subject}`,
  }));

  // Now do rendering safely
  if (subjects.length === 0) {
    return (
      <div className="text-center text-white mt-10">
        <p className="text-lg font-semibold">No subjects found.</p>
        <AddSubjectModal id={id} />
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="w-full px-2 pt-4">
        <div className="flex justify-center">
          <Carousel
            key={subjects.length}
            items={carouselItems}
            baseWidth={Math.min(window.innerWidth - 32, 340)}
            autoplay={false}
            pauseOnHover={true}
            loop={true}
            round={false}
            onRemove={handleRemove}
          />
        </div>
        <div className="mt-4 flex justify-center">
          <AddSubjectModal id={id} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 sm:p-6">
      {subjects.map((subject, index) => (
        <SubjectCard
          key={index}
          subject={subject}
          id={id}
          onRemove={() => handleRemove(subject)}
        />
      ))}
      <AddSubjectModal id={id} />
    </div>
  );
}
