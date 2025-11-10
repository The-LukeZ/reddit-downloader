export async function GET({ url }) {
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing ?url= parameter", { status: 400 });
  }

  try {
    const response = await fetch(targetUrl);

    // Copy headers (important for content-type, caching, etc.)
    const headers = new Headers();
    for (const [key, value] of response.headers) {
      // Strip headers that would break the response
      if (!["transfer-encoding", "connection", "content-length", "content-encoding"].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    }

    // Optional: add CORS headers so you can also call this from elsewhere
    headers.set("Access-Control-Allow-Origin", "*");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (err: any) {
    return new Response("Proxy error: " + err.message, { status: 502 });
  }
}
