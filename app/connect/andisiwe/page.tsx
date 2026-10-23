import { redirect } from "next/navigation";

/** Permanent public QR route; the static immersive experience supplies its own full-screen shell. */
export default function AndisiweConnect() {
  redirect("/connect/andisiwe.html");
}
