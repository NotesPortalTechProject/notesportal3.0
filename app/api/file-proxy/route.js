export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("url");
  const filename = searchParams.get("name") || "file";

  if (!fileUrl) {
    return new Response("Missing file URL", { status: 400 });
  }

  try {
    const res = await fetch(fileUrl);

    if (!res.ok) {
      return new Response(`Error fetching file: ${res.status}`, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=31536000"
      }
    });
  } catch (err) {
    return new Response(`Fetch error: ${err.message}`, { status: 500 });
  }
}