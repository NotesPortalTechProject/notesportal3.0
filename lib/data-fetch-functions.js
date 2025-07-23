import { supabase } from "./supabaseClient";

export async function getUserData(id) {
    const {data,error} = await supabase.from('users').select('*').eq('id',id).single();
    if(error){
        throw new error('failed to fetch userdata')
    }
    return data;
}