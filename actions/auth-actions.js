'use server'

// SIGNUP FUNCTION
export async function signup(prevState,formData) {
    const name = formData.get('email');
    const username = formData.get('username');
    const emailid = formData.get('email');
    const password = formData.get('password');
    const confirmpassword = formData.get('confirmpassword');
    const nsubjects = formData.get('nsubjects');

    let errors = [];

    // VALIDATION
    if(!name || name.length==0 || name.length<3){
        errors.push('Name not defined or too small');
    }

    if(!username || username.length==0 || username.length<3){
        errors.push('Username not defined or too small');
    }

    if(!emailid || emailid.length==0 || !emailid.includes('@')){
        errors.push('Email id not defined or invalid');
    }

    if(!password || password.trim().length<8){
        errors.push('Password not defined or too small');
    }

    if(password!=confirmpassword){
        errors.push('Passwords dont match');
    }

    if(!nsubjects || nsubjects==0){
        errors.push('No of Subjects Error');
    }

    if(errors.length>0){
        return { errors };
    }

    let subjectslist=[];
    for(let i=0;i<nsubjects;i++){
        subjectslist.push(formData.get(`subject${i}`))
    }

    console.log(subjectslist)
}

// LOGIN FUNCTION password
export async function login_with_password(prevState,formData) {
    const username = formData.get('username')
    const password = formData.get('password')
    let errors = [];
    if(!username || username.length==0){
        errors.push('username not defined');
    }
    if(!password || password.length==0){
        errors.push('password not defined');
    }

    if(errors.length>0){
        return { errors };
    }
}

// LOGIN FUNCTION otp
export async function login_with_otp(prevState,formData) {
    const emailId = formData.get('email')
    const otp = formData.get('otp')
    let errors = [];
    if(!emailId || emailId.length==0 || !emailId.includes('@')){
        errors.push('Email id not defined or invalid')
    }
    if(!otp || otp.length==0){
        errors.push('Otp not defined')
    }

    if(errors.length>0){
        return { errors };
    }
}