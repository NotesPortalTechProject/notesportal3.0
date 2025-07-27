'use server'
import { supabase } from "@/lib/supabaseClient"
import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";

export async function ToggleFiletoFavourites(fileid,userid,src) {
    const {data,error} = await supabase.from('users').select('favorites_new').eq('id',userid).single();
    if(error){
        throw new Error('couldnt fetch favorite files')
    }

    let favFilesList = data.favorites_new || [];
    const alreadyFav = favFilesList.includes(fileid);

    if(alreadyFav){
        favFilesList = favFilesList.filter(id => id!==fileid)
    }
    else{
        favFilesList.push(fileid)
    }

    const { error: error2} = await supabase.from('users').update({'favorites_new':favFilesList}).eq('id',userid);

    if(error2){
        throw new Error('couldnt update favorite files');
    }
    
    revalidatePath(src)
}

export async function IsFileinFav(fileid,userid) {
    const {data,error} = await supabase.from('users').select('favorites_new').eq('id',userid).single();
    if(error){
        throw new Error('couldnt fetch favorite files')
    }

    const favFilesList = data.favorites_new || []
    return favFilesList.includes(fileid)
}