'use server'
import { supabase } from "@/lib/supabaseClient"
import { revalidatePath } from "next/cache";

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

export async function EmailExists(email) {
    const {data,error} = await supabase.from('users').select('email').eq('email',email).maybeSingle();
    if(error){
        throw new Error('Couldnt get email Id some error occured');
    }
    if(data){
        return 0
    }
    return 1
}

