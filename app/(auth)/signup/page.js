'use client'
import { signup } from "@/actions/auth-actions";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";


export default function SignupPage() {
    const [noOfSubjects, setNoOfSubjects] = useState(0);
    const [formState, formAction] = useActionState(signup, {errors:[]});
    const { pending } = useFormStatus();
    

    function handleSubjectsChange(event) {
        const value = parseInt(event.target.value);
        if (!isNaN(value)) {
            setNoOfSubjects(value);
        } else {
            setNoOfSubjects(0);
        }
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100">
            <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-md w-full max-w-md">
                <p className="text-2xl font-semibold mb-4 text-center">Sign Up</p>
                <form className="flex flex-col gap-4" action={formAction}>
                    <div>
                        <label htmlFor="name" className="block mb-1">First name:</label>
                        <input type="text" name="firstname" required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="name" className="block mb-1">Last name:</label>
                        <input type="text" name="lastname" required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="username" className="block mb-1">UserName:</label>
                        <input type="text" name="username" required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-1">Email:</label>
                        <input type="text" name="email" required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-1">Password:</label>
                        <input type="password" name="password" required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="confirmpassword" className="block mb-1">Confirm Password:</label>
                        <input type="password" name="confirmpassword" required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="nsubjects" className="block mb-1">Number of Subjects:</label>
                        <input type="number" name="nsubjects" required onChange={handleSubjectsChange} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {Array.from({ length: noOfSubjects }, (_, index) => (
                        <div key={index}>
                            <label htmlFor={`subject${index}`} className="block mb-1">Subject {index + 1}:</label>
                            <input type="text" name={`subject${index}`} required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    ))}

                    <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors" disabled={pending}>{pending ? 'Submitting Form...':'Sign Up'}</button>
                </form>
                <p className="mt-4 text-center">
                    already have an account? <Link href={"/login"} className="text-blue-400 hover:underline">Login</Link>
                </p>
                {/* TEMPORARY LINK */}
                <p className="mt-4 text-center">
                    <Link href={"/4eae3ce9-a2ff-45c1-8a13-3f5bc9eddfb3/home"} className="text-blue-400 hover:underline">HOME PAGE TESTING ROUTE</Link>
                </p>
            </div>
            <div>
                {formState.errors && (
                    <ul>
                        {formState.errors.map((error, index) => (
                            <li key={index} className="text-red-400">{error}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
