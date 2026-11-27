import localFont from "next/font/local";
// The file is Inter (OFL) cut to the Latin characters the site uses and to the layout features its CSS uses
// (calt, locl, kern, tnum, pnum), both variable axes kept: 69 KB, pixel-identical to the previous 108 KB cut (W2, DR-003).
// Not preloaded: a preload made the font take bandwidth before the hero photograph (the LCP element) on slow phones;
// requested from the stylesheet instead it still arrives at the same time there (measured), and the swap uses
// next/font's metric-matched fallback, so nothing shifts (CLS 0.0005).
export const inter = localFont({ src: "../_fonts/inter/InterVariable.woff2", weight: "100 900", style: "normal", variable: "--font-body", display: "swap", preload: false });
