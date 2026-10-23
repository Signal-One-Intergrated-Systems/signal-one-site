import { getProfile } from "../../../lib/profiles";
import { resolveVisitorLink } from "../../../lib/links";
import { createQrSvg } from "../../../lib/qr";

/** Closed-by-default QR endpoint: registered profiles and one operator-approved host. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ profile: string }> },
) {
  const { profile: profileId } = await params;
  if (!getProfile(profileId)) return new Response("Not found", { status: 404 });
  const link = resolveVisitorLink(profileId, process.env.CONNECT_PUBLIC_ORIGIN);
  if (!link) {
    return new Response("QR sharing is not configured", {
      status: 503,
      headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  }
  return new Response(createQrSvg(link.url), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=60",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'none'; sandbox",
    },
  });
}
