"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSubjectViewMode } from "./subject-view-mode-context";
import { useSubjectListState } from "../subject-cards/use-subject-list-state";
import SubjectCards from "../subject-cards/subject-cards";
import FunSubjectGraph from "./fun-subject-graph";

const transition = { duration: 0.25, ease: "easeOut" };

export default function SubjectView({ subjects: initialSubjects, id }) {
  const { mode } = useSubjectViewMode();
  const { subjects, handleRemove } = useSubjectListState(initialSubjects, id);
  const reduceMotion = useReducedMotion();

  const variants = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.98 } };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {mode === "fun" ? (
        <motion.div
          key="fun"
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={transition}
        >
          <FunSubjectGraph subjects={subjects} id={id} />
        </motion.div>
      ) : (
        <motion.div
          key="default"
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={transition}
        >
          <SubjectCards subjects={subjects} id={id} onRemove={handleRemove} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
