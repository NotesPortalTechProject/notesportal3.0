import { supabase } from "./supabaseClient";

export async function getUserData(id) {
    const {data,error} = await supabase.from('users').select('*').eq('id',id).single();
    if(error){
        throw new Error('failed to fetch userdata')
    }
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
    const {data,error} = await supabase.from('users').select('favorites').eq('id',id).single();
    return data.favorites
}