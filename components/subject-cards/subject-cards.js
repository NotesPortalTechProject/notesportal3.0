import Link from "next/link";

export default function SubjectCards({ subjects, id}) {
    return (
        <>
            <div className="grid grid-cols-4 gap-4 p-4">
                {subjects.map((subject, index) => (
                    <Link href={`/${id}/subject/${subject}`} key={index}>
                        <div
                            key={index}
                            className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl w-32 h-32 flex flex-col justify-between p-2 text-white shadow-md"
                        >
                            <p className="text-sm font-semibold">{subject}</p>
                            <div className="flex justify-end">
                                <button className="text-lg">⋮</button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}
