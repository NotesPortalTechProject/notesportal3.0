'use client'
import { login_with_otp } from "@/actions/auth-actions";
import Link from "next/link";
import { useActionState } from "react";

export default function LoginWithOtpPage() {
    const [formState, formAction] = useActionState(login_with_otp, {});
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100">
                <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-md w-full max-w-md">
                    <p className="text-2xl font-semibold mb-4 text-center">Login Page</p>
                    <p className="text-md font-light mb-4 "><Link href={'/login'}>login with password</Link></p>
                    <form className="flex flex-col gap-4" action={formAction}>
                        <div>
                            <label htmlFor="email" className="block mb-1">Email Id:</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="enter email here"
                                required
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="otp" className="block mb-1">Otp:</label>
                            <input
                                type="text"
                                name="otp"
                                placeholder="enter otp here"
                                required
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors"
                        >
                            Submit
                        </button>

                        <div>
                            {formState.errors && (
                                <ul>
                                    {formState.errors.map((error, index) => (
                                        <li key={index} className="text-red-400">{error}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </form>

                    <p className="mt-4 text-center">
                        Don't have an account?{" "}
                        <Link href={"/signup"} className="text-blue-400 hover:underline">
                            Signup
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}