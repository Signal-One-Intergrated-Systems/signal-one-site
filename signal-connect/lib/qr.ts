import { qrcodegen } from "./vendor/qrcodegen";

/** Pure server-side QR rendering. No remote QR service, secrets, or user input. */
export function createQrSvg(visitorUrl: string): string {
  if (!visitorUrl.startsWith("https://")) {
    throw new Error("QR links require an approved HTTPS origin");
  }
  const symbol = qrcodegen.QrCode.encodeText(visitorUrl, qrcodegen.QrCode.Ecc.MEDIUM);
  const border = 4; // ISO quiet zone, four full QR modules on every side.
  const size = symbol.size + border * 2;
  const parts: string[] = [];
  for (let y = 0; y < symbol.size; y++) {
    for (let x = 0; x < symbol.size; x++) {
      if (symbol.getModule(x, y)) parts.push(`M${x + border},${y + border}h1v1h-1z`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="264" height="264" role="img" aria-label="Scan to connect with Signal One" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path fill="#000" d="${parts.join(" ")}"/></svg>`;
}
