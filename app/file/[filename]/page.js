import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabaseClient";
import { decrypt } from "@/lib/session";


export default async function FilePage({ params }) {
  const { filename } = params;

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return redirect("/login");
  }

  const { data, error } = await supabase
    .from("notes")
    .select("filelink")
    .eq("filename", filename)
    .single();

  if (error || !data?.filelink) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        File not found or access denied.
      </div>
    );
  }

  return redirect(data.filelink);
}
