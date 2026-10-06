import { NextResponse, type NextRequest } from "next/server";

/**
 * Canonical host redirect. Disabled unless CANONICAL_REDIRECT=1. When on, any
 * request that arrives on a *.railway.app host is redirected (308) to the
 * canonical origin from NEXT_PUBLIC_SITE_URL. Turn it on once DNS for the
 * canonical domain is live.
 */
export function proxy(request: NextRequest) {
  if (process.env.CANONICAL_REDIRECT !== "1") return NextResponse.next();

  const canonical = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://signalone.co.za");
  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").split(":")[0].toLowerCase();
  if (host.endsWith(".railway.app") && host !== canonical.hostname) {
    const target = new URL(request.nextUrl.pathname + request.nextUrl.search, canonical.origin);
    return NextResponse.redirect(target, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png).*)"],
};
