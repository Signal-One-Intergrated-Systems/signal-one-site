import { NextResponse } from "next/server";

const MAX_CV_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function configuredSlots() {
  return (process.env.SIGNAL_ONE_SALES_INTERVIEW_SLOTS || "")
    .split("|")
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const vacancies = Math.max(0, Number.parseInt(process.env.SIGNAL_ONE_SALES_VACANCIES || "10", 10) || 0);
  if (vacancies <= 0) {
    return NextResponse.json({ message: "Sales applications are currently closed." }, { status: 409 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid application." }, { status: 400 });
  }

  const cv = form.get("cv");
  if (!(cv instanceof File) || cv.size <= 0 || cv.size > MAX_CV_BYTES || !ALLOWED_TYPES.has(cv.type)) {
    return NextResponse.json({ message: "Please attach a PDF, DOC or DOCX CV no larger than 5 MB." }, { status: 400 });
  }

  const required = ["fullName", "email", "mobile", "city", "experience", "motivation"] as const;
  const values: Record<string, string> = {};
  for (const key of required) {
    const value = form.get(key);
    if (typeof value !== "string" || !value.trim()) {
      return NextResponse.json({ message: "Please complete all required application fields." }, { status: 400 });
    }
    values[key] = value.trim();
  }

  const securityExperience = form.get("securityExperience");
  if (typeof securityExperience === "string") values.securityExperience = securityExperience.trim();

  const interviewSlot = form.get("interviewSlot");
  if (typeof interviewSlot === "string" && interviewSlot) {
    if (!configuredSlots().includes(interviewSlot)) {
      return NextResponse.json({ message: "That interview time is no longer available." }, { status: 409 });
    }
    values.interviewSlot = interviewSlot;
  }

  const target = process.env.SIGNAL_ONE_INTAKE_URL;
  const token = process.env.SIGNAL_ONE_INTAKE_TOKEN;
  if (!target) {
    return NextResponse.json(
      { message: "The recruitment intake connection is being activated. Please email sales@signalone.co.za in the meantime." },
      { status: 503 },
    );
  }

  const bytes = Buffer.from(await cv.arrayBuffer());
  try {
    const upstream = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        kind: "sales",
        source: "signal-one-site",
        data: {
          ...values,
          intent: "internal-sales-representative-application",
          vacancyCountAtSubmission: vacancies,
          cv: {
            fileName: cv.name,
            contentType: cv.type,
            size: cv.size,
            base64: bytes.toString("base64"),
          },
        },
      }),
      cache: "no-store",
    });

    const body = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return NextResponse.json(
        { message: typeof body?.message === "string" ? body.message : "We could not send your application." },
        { status: upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502 },
      );
    }

    return NextResponse.json({
      message:
        typeof body?.message === "string"
          ? body.message
          : values.interviewSlot
            ? "Your application and requested interview time have been received."
            : "Your application has been received. We will contact shortlisted applicants when interview times are available.",
    });
  } catch {
    return NextResponse.json({ message: "The recruitment service is temporarily unavailable." }, { status: 502 });
  }
}
