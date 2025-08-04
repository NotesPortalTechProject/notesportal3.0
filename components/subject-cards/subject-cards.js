"use client";
import SubjectCard from "../subject-card";
import AddSubjectModal from "../edit-subjects/add-sub";

export default function SubjectCards({ subjects, id }) {
  const handleRemove = (sub) => {
    console.log("Remove subject:", sub);
    // Add actual remove logic here
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 sm:p-6">
      {subjects.map((subject, index) => (
        <SubjectCard
          key={index}
          subject={subject}
          id={id}
          onRemove={handleRemove}
        />
      ))}
      <AddSubjectModal id={id} />
    </div>
  );
}
