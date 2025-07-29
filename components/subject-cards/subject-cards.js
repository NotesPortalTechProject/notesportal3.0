import Link from "next/link"
import SubjectCard from "../subject-card"

export default function SubjectCards({ subjects, id }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 sm:p-6">
            {subjects.map((subject, index) => (
                <Link href={`/${id}/subject/${subject}`} key={index}>
                    <SubjectCard subject={subject}/>
                </Link>
            ))}
        </div>
    )
}
