'use client'
import Link from "next/link";
import { useState } from "react";
export default function SignupPage() {
    const [state,setState]=useState(0);

    let subjectfields;
    function setState(){
        
    }
    return (
        <>
            <div>
                <p>Sign Up</p>
            </div>
            <div>
                <form>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" required />
                    <label htmlFor="username">UserName:</label>
                    <input type="text" name="username" required />
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" required />
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" required />
                    <label htmlFor="confirmpassword">Confirm Password:</label>
                    <input type="password" name="confirmpassword" required />
                    <label htmlFor="Subjects">Number of Subjects:</label>
                    <input type="number" name="nsubjects" required onChange={setState}/>
                    <button>Submit</button>
                </form>
            </div>
            <div>
                <p>already have an account? <Link href={"/login"}>login</Link></p>
            </div>
        </>
    );
}