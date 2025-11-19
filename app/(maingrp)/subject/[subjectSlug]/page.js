import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";


export default async function FilePage({ params }) {
  const subjectname = params.subjectSlug;

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return redirect("/login");
  }

  return redirect(`/${session.userId}/subject/${subjectname}`);
}
