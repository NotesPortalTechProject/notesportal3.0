'use server'
import { supabase } from "@/lib/supabaseClient";

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

    const { usernameCheck} = await supabase.from('users').select('*').eq('username', username);
    if (usernameCheck) {
        errors.push('Username already in use try something different')
    }

    const emailIdCheck = await supabase.from('users').select('*').eq('email', emailid);
    if (emailIdCheck) {
        errors.push('Email Id already exists')
    }

    let subjectslist = [];
    for (let i = 0; i < nsubjects; i++) {
        let subjectcode = formData.get(`subject${i}`)
        if (!subjectcode || subjectcode.length == 0 || subjectcode.length > 3) {
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

    const { data } = await supabase.from('users').insert([
        {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email:emailid,
            subjects:subjectslist,

        }
    ])
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

    if (errors.length > 0) {
        return { errors };
    }
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

    if (errors.length > 0) {
        return { errors };
    }
}