"use client";

import { useEffect } from "react";
import { captureAttribution } from "../lib/attribution";

/** Records the campaign that brought this visit (see lib/attribution.ts). Renders nothing. */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
