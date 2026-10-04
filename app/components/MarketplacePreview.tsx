"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PublicGuard = {
  id: string;
  displayName: string;
  grade: string | null;
  experienceYears: number | null;
  areas: string[];
  skills: string[];
  availability: string | null;
};

export default function MarketplacePreview({ limit = 6 }: { limit?: number }) {
  const [profiles, setProfiles] = useState<PublicGuard[] | null>(null);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    let live = true;
    fetch(`/api/marketplace?limit=${limit}`)
      .then(async (response) => {
        const body = await response.json();
        if (!live) return;
        setConfigured(body.configured !== false);
        setProfiles(Array.isArray(body.profiles) ? body.profiles : []);
      })
      .catch(() => {
        if (live) setProfiles([]);
      });
    return () => {
      live = false;
    };
  }, [limit]);

  if (profiles === null) {
    return <div className="h-48 animate-pulse rounded-3xl border border-white/10 bg-white/[.03]" aria-label="Loading Guard Marketplace" />;
  }

  if (!configured || profiles.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[.03] p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#39bdf8]">Guard Marketplace</p>
        <h3 className="mt-3 text-2xl font-semibold text-white">Verified guard supply, connected to Guard.</h3>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
          Public profiles will appear here only when a guard has opted into marketplace visibility and Guard has verified the publishable fields. No private personnel record is exposed on the public site.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/guards/join" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#071018]">Join as a guard</Link>
          <Link href="/get-started" className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/75">I need guards</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {profiles.map((profile) => (
        <article key={profile.id} className="rounded-3xl border border-white/10 bg-white/[.035] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-white">{profile.displayName}</p>
              <p className="mt-1 text-sm text-white/45">{profile.grade || "Grade pending"}{profile.experienceYears !== null ? ` · ${profile.experienceYears} yrs` : ""}</p>
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-200">
              Verified
            </span>
          </div>
          {profile.skills.length ? <p className="mt-5 text-sm leading-6 text-white/65">{profile.skills.slice(0, 4).join(" · ")}</p> : null}
          {profile.areas.length ? <p className="mt-4 text-xs text-white/35">{profile.areas.slice(0, 3).join(" · ")}</p> : null}
          {profile.availability ? <p className="mt-4 text-xs font-medium text-[#7dd3fc]">{profile.availability}</p> : null}
        </article>
      ))}
    </div>
  );
}
