import { supabase } from "./supabaseClient";

export async function getUserData(id) {
    const {data,error} = await supabase.from('users').select('*').eq('id',id).single();
    if(error || !data){
        throw new Error('failed to fetch userdata')
    }
    return data;
}

export async function getUserDataByEmail(email) {
    const {data,error} = await supabase.from('users').select('*').eq('email',email).single();
    if(error || !data){
        throw new Error('failed to fetch userdata')
    }
    return data;
}

export async function getUserDataByUsername(username) {
    const {data,error} = await supabase.from('users').select('*').eq('username',username).single();
    if(error || !data){
        throw new Error('failed to fetch userdata')
    }
    console.log(data)
    return data;
}

export async function getUserId(username){
    const {data,error} = await supabase.from('users').select('id').eq('username',username).single();
    if(error){
        throw new Error('failed to fetch user id')
    }
    return data.id;
}

export async function getUserSubjectList(id){
    const {data,error} = await supabase.from('users').select('subjects').eq('id',id).single();
    if(error){
        throw new Error('failed to fetch subjects')
    }
    return data.subjects;
}

export async function getSubjectFiles(subjectname) {
    const {data,error} = await supabase.from('notes').select('*').eq('subjectname',subjectname);
    if(error){
        throw new Error('failed to fetch files')
    }
    return data;
}

export async function getNotesLatestWeeks(n) {
  const now = new Date();
  const nWeeksAgo = new Date();
  nWeeksAgo.setDate(now.getDate() - (n * 7));
  const nWeeksAgoISO = nWeeksAgo.toISOString();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .gte('created_at', nWeeksAgoISO);

  if (error) {
    console.error(`Error fetching notes for last ${n} weeks:`, error);
    return [];
  }

  return data;
}

export async function getFavFiles(id) {
    const {data,error} = await supabase.from('users').select('favorites_new').eq('id',id).single();
    if(error){
        throw new Error('couldnt fetch favorite files')
    }
    
    const favFilesIdList = data.favorites_new
    if(favFilesIdList.length==0){
        return [];
    }

    const {data:favfilesdata,error:favfileserror} = await supabase.from('notes').select('*').in('id',favFilesIdList);

    if(favfileserror){
        throw new Error('couldnt fetch favorite files')
    }

    return favfilesdata
}

export async function  getStoredOtp(emailId) {
    const {data,error} = await supabase.from('users').select('otp').eq('email',emailId).single();
    if(error){
        throw new Error('Couldnt fetch Otp, try again later')
    }
    return data.otp;
}

export async function getCurrentPasswordById(id) {
    const {data,error} = await supabase.from('users').select('password').eq('id',id).single();
    if(error){
        throw new Error('Couldnt fetch password some error occured')
    }
    return data.password
}

