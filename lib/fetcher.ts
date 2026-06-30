import dns from "node:dns/promises";

import * as cheerio from "cheerio";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_CONTENT_LENGTH = 5000;

function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function extractDomain(url: string): string {
  return new URL(normalizeUrl(url)).hostname.replace(/^www\./, "");
}

function isPrivateAddress(address: string): boolean {
  if (address === "::1" || address === "0.0.0.0") return true;
  if (/^f[cd][0-9a-f]{2}:/i.test(address)) return true; // IPv6 unique local
  if (/^fe[89ab][0-9a-f]:/i.test(address)) return true; // IPv6 link-local

  const ipv4 = address.startsWith("::ffff:") ? address.slice(7) : address;
  const parts = ipv4.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

// Resolves the hostname and rejects loopback/private/link-local targets up
// front — closes the SSRF path where a user-supplied URL points at internal
// infrastructure (e.g. cloud metadata endpoints) instead of a real prospect site.
async function assertSafeHost(hostname: string): Promise<void> {
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    throw new Error("Refusing to fetch a local address");
  }
  const { address } = await dns.lookup(hostname);
  if (isPrivateAddress(address)) {
    throw new Error("Refusing to fetch a private or internal address");
  }
}

function extractText(html: string): string {
  const $ = cheerio.load(html);
  $("script, style, nav, footer, header, noscript").remove();
  const text = $("body").text();
  return text.replace(/\s+/g, " ").trim().slice(0, MAX_CONTENT_LENGTH);
}

export async function fetchWebsiteText(url: string): Promise<string> {
  const normalized = normalizeUrl(url);
  await assertSafeHost(new URL(normalized).hostname);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(normalized, {
      signal: controller.signal,
      // Manual redirect handling so a 3xx to a private address can't bypass
      // the host check above — any redirect is treated as a failed fetch.
      redirect: "manual",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PitchSnapBot/1.0; +https://pitchsnap.app)",
      },
    });

    if (!response.ok) {
      throw new Error(`Website responded with status ${response.status}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      throw new Error(`Unexpected content-type: ${contentType}`);
    }

    const html = await response.text();
    const text = extractText(html);
    if (!text) {
      throw new Error("No readable text found on website");
    }
    return text;
  } finally {
    clearTimeout(timeout);
  }
}
