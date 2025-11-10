import { error } from "@sveltejs/kit";

export async function GET({ url }) {
  const shareUrl = url.searchParams.get("url");

  if (!shareUrl) {
    error(400, "Missing ?url= parameter");
  }

  try {
    new URL(shareUrl);
  } catch {
    error(400, "Invalid URL");
  }

  // fetch the URL without following redirects
  try {
    const response = await fetch(shareUrl, { redirect: "manual" });
    const location = response.headers.get("location");
    console.log("Fetched URL:", shareUrl, "Redirect location:", location);

    if (location) {
      return new Response(location, { status: 200 });
    } else {
      new Error("No redirect location found");
    }
  } catch (err: any) {
    error(502, "Error fetching URL: " + err.message);
  }
}
