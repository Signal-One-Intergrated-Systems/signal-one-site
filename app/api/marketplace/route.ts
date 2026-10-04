import { NextResponse } from "next/server";

type UpstreamProfile = Record<string, unknown>;

function strings(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").slice(0, limit);
}

function sanitise(profile: UpstreamProfile) {
  return {
    id: typeof profile.id === "string" ? profile.id : crypto.randomUUID(),
    displayName: typeof profile.displayName === "string" ? profile.displayName : "Verified guard",
    grade: typeof profile.grade === "string" ? profile.grade : null,
    experienceYears: typeof profile.experienceYears === "number" ? profile.experienceYears : null,
    areas: strings(profile.areas, 6),
    skills: strings(profile.skills, 8),
    availability: typeof profile.availability === "string" ? profile.availability : null,
  };
}

export async function GET(request: Request) {
  const target = process.env.GUARD_MARKETPLACE_URL;
  const token = process.env.GUARD_MARKETPLACE_TOKEN;
  if (!target) {
    return NextResponse.json({ configured: false, profiles: [] });
  }

  const url = new URL(request.url);
  const requestedLimit = Number(url.searchParams.get("limit") || "12");
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 24) : 12;

  try {
    const upstream = await fetch(`${target}${target.includes("?") ? "&" : "?"}limit=${limit}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json({ configured: true, profiles: [] }, { status: 200 });
    }

    const body = await upstream.json();
    const raw = Array.isArray(body) ? body : Array.isArray(body?.profiles) ? body.profiles : [];
    return NextResponse.json({
      configured: true,
      profiles: raw.slice(0, limit).map((profile: UpstreamProfile) => sanitise(profile)),
    });
  } catch {
    return NextResponse.json({ configured: true, profiles: [] }, { status: 200 });
  }
}
