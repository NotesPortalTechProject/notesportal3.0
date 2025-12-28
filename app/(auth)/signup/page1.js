import { signup } from "@/actions/auth-actions";
import { useActionState, useState } from "react";

export default function SignupPage(){
    const [step,setStep] = useState(1);
    const [formState,formAction,isPending] = useActionState(signup,{});

    // STEP 1 - FIRST,LAST AND USERNAME
    const [firstname,setFirstname] = useState("");
    const [lastname,setLastname] = useState("");
    const [username,setUsername] = useState("");

    // STEP 2 - EMAIL AND OTP VERIFICATION
    const [email,setEmail] = useState("");
    const []
}