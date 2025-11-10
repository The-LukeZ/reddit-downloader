import { error } from "@sveltejs/kit";

export async function GET({ url }) {
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing ?url= parameter", { status: 400 });
  }

  try {
    new URL(targetUrl);
  } catch {
    error(400, "Invalid URL");
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json; charset=UTF-8",
        "Cache-Control": "public, max-age=86400",
      },
    });

    // Copy headers (important for content-type, caching, etc.)
    const headers = new Headers({
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "public, max-age=86400",
    });
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
