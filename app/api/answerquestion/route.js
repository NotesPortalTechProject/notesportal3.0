import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { answer, question, context } = await req.json();
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    let apiUrl = process.env.PYTHON_API_URL+"/answerquestion" ||"http://127.0.0.1:8000/answerquestion";
    const queryParams = new URLSearchParams({ answer });
    const res = await fetch(`${apiUrl}?${queryParams.toString()}`, {
      method: "POST",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer,question, context }),
    });
    console.log("mangu")
    const text = await res.text();
    // console.log(text)
    return new Response(text, { status: res.status });
  } catch (err) {
    console.error("Error in /api/answerquestion:", err);
    return new Response("Error while checking answer", { status: 500 });
  }
}
