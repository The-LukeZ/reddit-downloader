export async function GET({ url, request }) {
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing ?url= parameter", { status: 400 });
  }

  try {
    new URL(targetUrl);
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }

  const ua = request?.headers?.get("user-agent") ?? "";

  // fxreddit-style: Don't proxy Reddit - redirect.
  // This significantly reduces the proxy traffic that looks like a site scraping reddit.
  // Simple redirect for browsers - they go directly to the source.
  return new Response(null, {
    status: 302,
    headers: {
      Location: targetUrl,
    },
  });
}
