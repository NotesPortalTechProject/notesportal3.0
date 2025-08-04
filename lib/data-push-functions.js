import { getUserData } from "./data-fetch-functions";
import { supabase } from "./supabaseClient";

export default async function StoreOtpWithEmailId(otp, userEmail) {
  const { data, error } = await supabase.from("users").update({ otp }).eq("email", userEmail);
  if (error) {
    throw new Error("Failed to save OTP, an error occurred"); 
  }

  return data;
}

export async function setPasswordById(password,id) {
  const {data,error} = await supabase.from("users").update({password}).eq("id",id);
  if(error){
    throw new Error("Failed to Set Password, Please try again");
  }
}

export async function updateUserSubjectlist(id,sub_code){
  const data = await getUserData(id);
  if (!data) {
    throw new Error("User data not found");
  }
  const usersubjectlist=JSON.parse(data.subjects);
  usersubjectlist.push(sub_code);

  const { data: updatedData, error: updateError } = await supabase
    .from("users").update({ subjects: JSON.stringify(usersubjectlist) }).eq("id", id);

  if (updateError) {
    throw new Error("Failed to update subject list, an error occurred");
  }

  return updatedData;
}