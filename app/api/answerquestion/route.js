export async function POST(req) {
  try {
    const {useranswer}= await req.json();

    let apiUrl = process.env.PYTHON_API_URL+"/answerquestion" || "http://127.0.0.1:8000/answerquestion";
    apiUrl = "http://127.0.0.1:8000/answerquestion"

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(useranswer)
    });

    const text = await res.text();
    return new Response(text, { status: res.status });
  } catch (err) {
    console.error("Error in /api/answerquestion:", err);
    return new Response("Error while checking answer", { status: 500 });
  }
}
