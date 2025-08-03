'use server'
import { getStoredOtp, getUserDataByEmail, getUserDataByUsername, getUserId} from "@/lib/data-fetch-functions";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
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

    // VALIDATION
    console.log('VALIDATION')
    if (!firstname || firstname.length == 0 || firstname.length < 3) {
        errors.push('First name not defined or too small');
    }

    if (!lastname || lastname.length == 0 || lastname.length < 3) {
        errors.push('Last name not defined or too small')
    }

    if (/\d/.test(firstname)) {
        errors.push('firstname cannot contain a numerical value')
    }

    if (/\d/.test(lastname)) {
        errors.push('lastname cannnot contain numerical values')
    }

    if (!username || username.length == 0 || username.length < 3) {
        errors.push('Username not defined or too small');
    }

    if (!emailid || emailid.length == 0 || !emailid.includes('@')) {
        errors.push('Email id not defined or invalid');
    }

    if (!password || password.trim().length < 8) {
        errors.push('Password not defined or too small');
    }

    if (password != confirmpassword) {
        errors.push('Passwords dont match');
    }

    if (!nsubjects || nsubjects == 0) {
        errors.push('No of Subjects Error');
    }

    const { data:usernameCheck, error:usernameError } = await supabase.from('users').select('*').eq('username', username);
    if (usernameCheck && usernameCheck.length>0) {
        errors.push('Username already in use try something different')
    }

    const { data:emailIdCheck,error:emailidError } = await supabase.from('users').select('*').eq('email', emailid);
    if (emailIdCheck && emailIdCheck.length>0) {
        errors.push('Email Id already exists')
    }

    let subjectslist = [];
    for (let i = 0; i < nsubjects; i++) {
        let subjectcode = formData.get(`subject${i}`)
        if (!subjectcode || subjectcode.length == 0 || subjectcode.length > 5) {
            errors.push('Subject code undefined or greater than 3 (length)')
            break
        }
        if (/\d/.test(subjectcode)) {
            errors.push('Subject code should not contain integer value')
        }
        subjectslist.push(formData.get(`subject${i}`))
    }

    if (errors.length > 0) {
        return { errors };
    }

    // HASHING PASSWORD
    const hashedPassword = hashUserPassword(password);

    console.log('STARTING INSERT')
    const { data , error } = await supabase.from('users').insert([
        {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email:emailid,
            subjects:subjectslist,
            password:hashedPassword

        }
    ])
    if(error){
        throw new error('An unexpected error occured'+error);
    }
    const userid = await getUserId(username)

    redirect(`/${userid}/home`)
}

// LOGIN FUNCTION password
export async function login_with_password(prevState, formData) {
    const username = formData.get('username')
    const password = formData.get('password')
    let errors = [];
    if (!username || username.length == 0) {
        errors.push('username not defined');
    }
    if (!password || password.length == 0) {
        errors.push('password not defined');
    }
    const userdata = await getUserDataByUsername(username)
    if(!userdata){
        errors.push('Invalid username, user not found')
    }
    if (errors.length > 0) {
        return { errors };
    }
    const isValidPassword = verifyPassword(userdata.password,password)
    if(!isValidPassword){
        errors.push('incorrect credentials');
    }

    if(errors.length>0){
        return {errors};
    }

    redirect(`/${userdata.id}/home`)
}

// LOGIN FUNCTION otp
export async function login_with_otp(prevState, formData) {
    const emailId = formData.get('email')
    const otp = formData.get('otp')
    let errors = [];
    if (!emailId || emailId.length == 0 || !emailId.includes('@')) {
        errors.push('Email id not defined or invalid')
    }
    if (!otp || otp.length == 0) {
        errors.push('Otp not defined')
    }
    const userExists = await getUserDataByEmail(emailId)
    if(!userExists){
        errors.push('Invalid Email Id Error')
    }

    if (errors.length > 0) {
        return { errors };
    }

    const storedOtp = await getStoredOtp(emailId)

    if(otp.trim() !== storedOtp.trim()){
        errors.push('Invalid Otp, Login attempted failed')
    }

    if (errors.length > 0) {
        return { errors };
    }

    if(otp.trim()===storedOtp.trim()){
        const userdata = await getUserDataByEmail(emailId);
        await supabase.from("users").update({otp:null}).eq('email',emailId)
        redirect(`/${userdata.id}/home`)
    }
}