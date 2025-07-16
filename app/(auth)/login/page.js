import Link from "next/link";

export default function LoginPage() {
    return (
        <>
            <div>
                <p>Login Page</p>
            </div>
            <div>
                <form>
                    <label htmlFor="email">Email Id:</label>
                    <input type="email" name="email" placeholder="enter email here" required />
                    <label htmlFor="otp">Otp</label>
                    <input type="text" name="otp" placeholder="enter otp here" required />
                    <button>Submit</button>
                    <div>
                        {/* DIV TO DISPLAY ERRORS */}
                    </div>
                </form>
            </div>
            <div>
                <p>dont have a account? <Link href={"/signup"}>signup</Link></p>
            </div>
        </>
    );
}