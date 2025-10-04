'use server';
import { checkAccountExistsEmail, checkAccountExistsUsername, getStoredOtp, getUserDataByEmail, getUserDataByUsername, getUserId } from "@/lib/data-fetch-functions";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createSession, deleteSession } from "@/lib/session";
import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";

// SIGNUP FUNCTION
export async function signup(prevState, formData) {
    const firstname = formData.get('firstname');
    const lastname = formData.get('lastname');
    const username = formData.get('username');
    const emailid = formData.get('email');
    const password = formData.get('password');
    const confirmpassword = formData.get('confirmpassword');
    const nsubjects = formData.get('nsubjects');

    let errors = [];

    if (!firstname || firstname.length < 3) errors.push('First name too short');
    if (!lastname || lastname.length < 3) errors.push('Last name too short');
    if (/\d/.test(firstname)) errors.push('First name cannot contain numbers');
    if (/\d/.test(lastname)) errors.push('Last name cannot contain numbers');
    if (!username || username.length < 3) errors.push('Username too short');
    if (!emailid || !emailid.includes('@')) errors.push('Invalid email');
    if (!password || password.trim().length < 8) errors.push('Password too short');
    if (password !== confirmpassword) errors.push('Passwords don’t match');
    if (!nsubjects || nsubjects == 0) errors.push('No subjects provided');

    const { data: usernameCheck } = await supabase.from('users').select('*').eq('username', username);
    if (usernameCheck?.length > 0) errors.push('Username already exists');

    const { data: emailCheck } = await supabase.from('users').select('*').eq('email', emailid);
    if (emailCheck?.length > 0) errors.push('Email already exists');

    let subjectslist = [];
    for (let i = 0; i < nsubjects; i++) {
        let subjectcode = formData.get(`subject${i}`);
        if (!subjectcode || subjectcode.length > 10) {
            errors.push('Invalid subject code');
            break;
        }
        if (/\d/.test(subjectcode)) errors.push('Subject code cannot contain numbers');

        subjectslist.push(subjectcode.toUpperCase());
    }

    if (errors.length > 0) return { errors };

    const hashedPassword = hashUserPassword(password);

    const { error } = await supabase.from('users').insert([{
        firstname,
        lastname,
        username,
        email: emailid,
        subjects: subjectslist,
        password: hashedPassword
    }]);
    if (error) throw new Error('Unexpected error: ' + error);

    const userid = await getUserId(username);

    await createSession(userid);
    redirect(`/${userid}/home`)
}

// LOGIN FUNCTION password
export async function login_with_password(prevState, formData) {
    const userNameorEmail = formData.get('username');
    const password = formData.get('password');
    let errors = [];

    if (!userNameorEmail) errors.push('Username required');
    if (!password) errors.push('Password required');
    let userExists = false;
    let inpt = '';
    if (userNameorEmail.includes('@')) {
        userExists = await checkAccountExistsEmail(userNameorEmail);
        inpt = 'email'
    } else {
        userExists = await checkAccountExistsUsername(userNameorEmail);
        inpt = 'username'
    }
    if (!userExists) {
        errors.push('No account associated with this username or email');
    }
    if (errors.length > 0) return { errors };
    let userdata;
    if (inpt === 'username') {
        userdata = await getUserDataByUsername(userNameorEmail);
    }
    else{
        userdata = await getUserDataByEmail(userNameorEmail)
    }
    const isValidPassword = verifyPassword(userdata.password, password);
    if (!isValidPassword) errors.push('Incorrect credentials');

    if (errors.length > 0) return { errors };

    await createSession(userdata.id);
    redirect(`/${userdata.id}/home`)
}

// LOGIN FUNCTION otp
export async function login_with_otp(prevState, formData) {
    const emailId = formData.get('email');
    const otp = formData.get('otp');
    let errors = [];

    if (!emailId || !emailId.includes('@')) errors.push('Invalid email');
    if (!otp) errors.push('OTP required');

    const userExists = await getUserDataByEmail(emailId);
    if (!userExists) errors.push('Email not found');

    if (errors.length > 0) return { errors };

    const storedOtp = await getStoredOtp(emailId);
    if (otp.trim() !== storedOtp.trim()) errors.push('Invalid OTP');

    if (errors.length > 0) return { errors };

    await supabase.from("users").update({ otp: null }).eq('email', emailId);

    await createSession(userExists.id);
    redirect(`/${userExists.id}/home`)
}

export async function logout() {
    await deleteSession();
    redirect("/");
}
