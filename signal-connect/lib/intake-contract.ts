import {
  validateExchange,
  type ExchangeFields,
} from "./exchange";

/**
 * SC-04B-1 — data contract ONLY. This module NEVER sends a request, collects
 * a contact, derives tenant/owner permissions or claims successful delivery.
 *
 * The receiving Sales OS endpoint does not yet accept phone-only records and
 * has not been authorized for public server-to-server intake. Until then,
 * Signal Connect remains the existing manual, user-controlled email flow.
 */
export const INTAKE_CONTRACT_VERSION = 1 as const;
export const INTAKE_NOTICE_VERSION = "signal-connect-contact-2026-10-23" as const;

export type ContactIntakeV1 = Readonly<{
  version: 1;
  source: "signal_connect";
  presenterId: "andisiwe";
  submissionId: string;
  contact: Readonly<{
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
  }>;
  interest: string | null;
  message: string | null;
  consent: Readonly<{
    purpose: "respond_to_introduction";
    noticeVersion: typeof INTAKE_NOTICE_VERSION;
    affirmative: true;
  }>;
}>;

export type ConfirmedIntakeReceipt = Readonly<{
  status: "created" | "existing";
  source: "signal_connect";
  persisted: true;
  recordId: string;
  submissionId: string;
}>;

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Called only after an explicit future submit gesture, using a caller-created
 * stable idempotency UUID. Never derive a key from PII.
 * The server, not the browser, must assign tenant, owner and receivedAt time.
 */
export function prepareContactIntake(
  details: ExchangeFields,
  submissionId: string,
): ContactIntakeV1 | null {
  if (!uuidPattern.test(submissionId)) return null;
  if (Object.keys(validateExchange(details)).length > 0) return null;

  return {
    version: INTAKE_CONTRACT_VERSION,
    source: "signal_connect",
    presenterId: "andisiwe",
    submissionId,
    contact: {
      name: details.name.trim(),
      email: details.email.trim() || null,
      phone: details.phone.trim() || null,
      company: details.company.trim() || null,
    },
    interest: details.interest || null,
    message: details.message.trim() || null,
    consent: {
      purpose: "respond_to_introduction",
      noticeVersion: INTAKE_NOTICE_VERSION,
      affirmative: true,
    },
  };
}

/**
 * A transport-level HTTP 2xx alone is NOT evidence of a stored contact.
 * Only a VERIFIED, authenticated receiving service can supply this receipt.
 * Structural validation here is necessary but not sufficient for trust.
 */
export function isConfirmedIntakeReceipt(
  value: unknown,
  submissionId: string,
): value is ConfirmedIntakeReceipt {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.status === "created" || candidate.status === "existing") &&
    candidate.source === "signal_connect" &&
    candidate.persisted === true &&
    typeof candidate.recordId === "string" &&
    uuidPattern.test(candidate.recordId) &&
    candidate.submissionId === submissionId &&
    uuidPattern.test(submissionId)
  );
}
