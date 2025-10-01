export async function POST(req) {
  try {
    const body = await req.json();

    let apiUrl = process.env.PYTHON_API_URL+"/askquestion" || "http://127.0.0.1:8000/askquestion";
    apiUrl = "http://127.0.0.1:8000/askquestion"

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    return new Response(text, { status: res.status });
  } catch (err) {
    console.error("Error in /api/askquestion:", err);
    return new Response("Error while fetching question", { status: 500 });
  }
}
