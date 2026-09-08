"use client";
import SubjectCard from "../subject-card";
import AddSubjectModal from "../edit-subjects/add-sub";
import { useSubjectListState } from "./use-subject-list-state";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Carousel = dynamic(() => import("../effects/carousel"), { ssr: false });

export default function SubjectCards({ subjects: subjectsProp, id, onRemove: onRemoveProp }) {
  const isControlled = onRemoveProp !== undefined;
  const internal = useSubjectListState(subjectsProp, id);
  const subjects = isControlled ? subjectsProp : internal.subjects;
  const handleRemove = isControlled ? onRemoveProp : internal.handleRemove;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const carouselItems = subjects.map((subject, index) => ({
    title: subject,
    description: "Click to view subject",
    id: index,
    icon: <span className="text-xs text-white font-bold">{subject[0]}</span>,
    href: `/subject/${subject}`,
  }));

  if (subjects.length === 0) {
    return (
      <div className="text-center text-white mt-10">
        <p className="text-lg font-semibold">No subjects found.</p>
        {!isControlled && <AddSubjectModal id={id} subjectList={subjects}/>}
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className={`w-full pt-4 flex flex-col ${isControlled ? "" : "px-2"}`}>
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
        {!isControlled && (
          <div className="mt-6 px-4">
            <AddSubjectModal id={id} subjectList={subjects} buttonClass="w-full py-4 text-3xl rounded-xl bg-gradient-to-r from-purple-600 to-purple-700"/>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${isControlled ? "py-4 sm:py-6" : "p-4 sm:p-6"}`}>
      {subjects.map((subject, index) => (
        <SubjectCard key={index} subject={subject} id={id} onRemove={() => handleRemove(subject)} />
      ))}
      {!isControlled && (
        <AddSubjectModal id={id} subjectList={subjects} buttonClass="w-full h-36 sm:h-40 max-w-[13rem] sm:max-w-[15rem] text-4xl"/>
      )}
    </div>
  );
}
