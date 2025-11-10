import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0";

export async function handleShare(shareUrl: string) {
  const url = new URL(shareUrl);
  url.hostname = "www.reddit.com";
  url.port = "";
  url.protocol = "https:";

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "public, max-age=86400",
    },
    redirect: "manual",
    signal: AbortSignal.timeout(2_000),
  });
  const location = response.headers.get("Location");
  return location;
}

export function isShareUrl(url: string) {
  const shareRegex = /^https?:\/\/(www\.)?reddit\.com\/r\/[^/]+\/s\/[^/]+/;
  return shareRegex.test(url);
}

// Remove all query parameters and fragments from a URL
export function sanitizeUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.search = "";
    parsedUrl.hash = "";
    return parsedUrl.toString();
  } catch {
    return url;
  }
}
