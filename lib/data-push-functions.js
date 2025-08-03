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