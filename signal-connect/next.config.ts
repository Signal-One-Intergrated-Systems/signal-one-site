import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  // Preserve the non-public original binaries in only the gated review handler.
  outputFileTracingIncludes: {
    "/review/story-media/[chapter]": [
      "./assets/story/reference/*.webp",
      "./public/media/hardware/hytera-pnc360s.webp",
    ],
  },
};

export default config;
