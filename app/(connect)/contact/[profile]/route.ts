import { getProfile } from "../../../_connect/lib/profiles";
import { vcard } from "../../../_connect/lib/vcard";
export async function GET(_request: Request, { params }: { params: Promise<{ profile: string }> }) { const profile = getProfile((await params).profile); if (!profile) return new Response("Not found", { status: 404 }); return new Response(vcard(profile), { headers: { "Content-Type": "text/vcard; charset=utf-8", "Content-Disposition": `attachment; filename="${profile.id}.vcf"`, "X-Content-Type-Options": "nosniff" } }); }
