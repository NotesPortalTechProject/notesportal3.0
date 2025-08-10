'use server'
import { getCurrentPasswordById } from "@/lib/data-fetch-functions";
import { setPasswordById } from "@/lib/data-push-functions";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { supabase } from "@/lib/supabaseClient"
import { revalidatePath } from "next/cache";
import { updateUserSubjectlist } from "@/lib/data-push-functions";
import { getUserData } from "@/lib/data-fetch-functions";

export async function ToggleFiletoFavourites(fileid, userid, src) {
    const { data, error } = await supabase.from('users').select('favorites_new').eq('id', userid).single();
    if (error) {
        throw new Error('couldnt fetch favorite files')
    }

    let favFilesList = data.favorites_new || [];
    const alreadyFav = favFilesList.includes(fileid);

    if (alreadyFav) {
        favFilesList = favFilesList.filter(id => id !== fileid)
    }
    else {
        favFilesList.push(fileid)
    }

    const { error: error2 } = await supabase.from('users').update({ 'favorites_new': favFilesList }).eq('id', userid);

    if (error2) {
        throw new Error('couldnt update favorite files');
    }

    revalidatePath(src)
}

export async function IsFileinFav(fileid, userid) {
    const { data, error } = await supabase.from('users').select('favorites_new').eq('id', userid).single();
    if (error) {
        throw new Error('couldnt fetch favorite files')
    }

    const favFilesList = data.favorites_new || []
    return favFilesList.includes(fileid)
}

export async function EmailExists(email) {
    const { data, error } = await supabase.from('users').select('email').eq('email', email).maybeSingle();
    if (error) {
        throw new Error('Couldnt get email Id some error occured');
    }
    if (data) {
        return 0
    }
    return 1
}

export async function setPassword(prevState, formData) {
    const password = formData.get('p1');
    const userId = formData.get('id')
    const confirmpassword = formData.get('p2');
    let errors = [];
    if (!password || password.length == 0) {
        errors.push('Password field cannot be empty');
    }
    if (!confirmpassword || confirmpassword.length == 0) {
        errors.push('Confirm Password field cannot be empty');
    }
    if (password !== confirmpassword) {
        errors.push('Passwords dont match try again');
    }
    if (password.length < 5) {
        errors, push('Password length too small')
    }

    if (errors.length > 0) {
        return { errors };
    }

    const hashedPassword = hashUserPassword(password);
    await setPasswordById(hashedPassword, userId);
    revalidatePath(`/${userId}/profile`)
}

export async function ResetPassword(prevState, formData) {
    const password = formData.get('p1');
    const userId = formData.get('id')
    const confirmpassword = formData.get('p2');
    let errors = [];
    if (!password || password.length == 0) {
        errors.push('Password field cannot be empty');
    }
    if (!confirmpassword || confirmpassword.length == 0) {
        errors.push('Confirm Password field cannot be empty');
    }
    if (password !== confirmpassword) {
        errors.push('Passwords dont match try again');
    }
    if (password.length < 5) {
        errors.push('Password length too small')
    }
        if (errors.length > 0) {
        return { errors };
    }
    const currPass = await getCurrentPasswordById(userId)
    const arePasswordSame = verifyPassword(currPass, password)
    if(arePasswordSame){
        errors.push('New password and old password cannot be same')
    }
    if (errors.length > 0) {
        return { errors };
    }

    const hashedPassword = hashUserPassword(password);
    await setPasswordById(hashedPassword, userId);
    revalidatePath(`/${userId}/profile`)
}

export async function UpdateSubjects(id, sub_code) {
    await updateUserSubjectlist(id, sub_code);
    revalidatePath(`/${id}/home`);
}

export async function removeUserSubject(id, sub_code) {
  const data = await getUserData(id);
  if (!data) throw new Error("User data not found");

  const usersubjectlist = JSON.parse(data.subjects || "[]");

  if (!usersubjectlist.includes(sub_code)) {
    throw new Error("Subject not found in your list");
  }

  const updatedList = usersubjectlist.filter((s) => s !== sub_code);

  const { error } = await supabase
    .from("users")
    .update({ subjects: JSON.stringify(updatedList) })
    .eq("id", id);

  if (error) throw new Error("Failed to update subject list");
}

export async function RemoveSubject(id, sub_code) {
  await removeUserSubject(id, sub_code);
  revalidatePath(`/${id}/home`);
}

export async function uploadFile(prevState,formData) {
    
}