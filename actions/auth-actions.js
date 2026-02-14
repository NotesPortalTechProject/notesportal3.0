'use server';
import { checkAccountExistsEmail, checkAccountExistsUsername, getStoredOtp, getUserDataByEmail, getUserDataByUsername, getUserId } from "@/lib/data-fetch-functions";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createSession, deleteSession } from "@/lib/session";
import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";
import { verifyOtpAction } from "./otp-action";

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
    if(!/^[a-zA-Z0-9_]+$/.test(username)) errors.push('Username cannot contain special characters')
    if(firstname==lastname) errors.push('Firstname and lastname cannot be same');
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
            errors.push('Subject code length should not be greater than 10');
            break;
        }

        if(subjectcode.length==1 || subjectcode.length<2){
            errors.push('Subject code must atleast have 2 letters');
            break;
        }

        if(!/^[a-zA-Z0-9_]+$/.test(subjectcode)){
            errors.push('Subject code cannot contain special characters');
            break;
        }

        // CALCULUS FIX
        if(subjectcode=="CAL"||subjectcode=="cal"){
            subjectcode="CALCULUS"
        }
        subjectslist.push(subjectcode.toUpperCase().trim());
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
    redirect(`/home`)
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
    else {
        userdata = await getUserDataByEmail(userNameorEmail)
    }
    const isValidPassword = verifyPassword(userdata.password, password);
    if (!isValidPassword) errors.push('Incorrect credentials');

    if (errors.length > 0) return { errors };

    await createSession(userdata.id);
    redirect(`/home`)
}

// LOGIN FUNCTION otp
export async function login_with_otp(prevState, formData) {
    const emailId = formData.get('email');
    const userotp = formData.get('otp');
    const otphash = formData.get('otphash');
    let errors = [];

    if (!emailId || !emailId.includes('@')) errors.push('Invalid email');
    if (!userotp) errors.push('OTP required');

    const userExists = await getUserDataByEmail(emailId);
    if (!userExists) errors.push('Email not found');

    if (errors.length > 0) return { errors };

    errors = [];

    const result = await verifyOtpAction(userotp,otphash);
    if(result.success){
        await createSession(userExists.id);
        redirect('/home');
    }else{
        errors.push(result.error)
        return { errors }
    }

    try{
        const result = await verifyOtpAction(userotp,otphash);
        if(result.success){
            await createSession(userExists.id)
            redirect('/home')
        }else{
            errors.push('Invalid OTP')
            return { errors }
        }
    }catch(error){

        return { errors }
    }
}

export async function logout() {
    await deleteSession();
    redirect("/");
}

// SIGNUP FUNCTION
export async function signup45(prevState, formData) {
    const nsubjects = formData.get('nsubjects');

    let errors = [];

    if (!nsubjects || nsubjects == 0) errors.push('No subjects provided');


    let subjectslist = [];
    for (let i = 0; i < nsubjects; i++) {
        let subjectcode = formData.get(`subject${i}`);
        if (!subjectcode || subjectcode.length > 10) {
            errors.push('Invalid subject code');
            break;
        }
        if (/\d/.test(subjectcode)) errors.push('Subject code cannot contain numbers');
        // CALCULUS FIX
        if (subjectcode == "CAL" || subjectcode == "cal") {
            subjectcode = "CALCULUS"
        }
        subjectslist.push(subjectcode.toUpperCase().trim());
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
    redirect(`/home`)
}



