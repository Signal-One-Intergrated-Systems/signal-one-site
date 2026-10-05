import type { Metadata } from "next";
import InsightArticle from "../../components/InsightArticle";

export const metadata: Metadata = {
  title: "What Makes an Electronic Occurrence Book Useful",
  description: "Why a digital occurrence book creates more value when it connects to attendance, patrols, incidents and service proof.",
};

export default function Article() {
  return (
    <InsightArticle
      eyebrow="Operational record"
      title="A digital occurrence book is not just a paper book on a screen."
      dek="Digitising the page is useful. Connecting the occurrence to the rest of the operation is where the operating value begins."
      published="2026-10-05"
      related={[
        { href: "/solutions/security/electronic-occurrence-book", label: "Electronic occurrence book" },
        { href: "/solutions/security/client-proof", label: "Client proof" },
        { href: "/solutions/security/attendance", label: "Attendance" },
      ]}
    >
      <p>Replacing handwriting with a digital form makes information easier to store and search. But if the electronic occurrence book remains isolated from attendance, patrols, incidents and the control room, the company still has to reconstruct the operating story from separate systems.</p>
      <h2>An occurrence has context</h2>
      <p>An operational event belongs to a site, happens at a time, involves people and can change what management needs to know. The record becomes more valuable when it can be understood alongside who was on duty, what patrol work occurred and what response followed.</p>
      <h2>Preserve the sequence</h2>
      <p>A useful occurrence record should make the chronology of the shift clearer, not easier to rewrite. Corrections and deactivations should preserve operational history rather than erase the context management may need later.</p>
      <h2>Use the record twice</h2>
      <p>The first use is operational: supervisors and control-room teams need the record to understand what happened. The second use is commercial: management may need the same evidence when explaining service delivery to a client.</p>
      <p>That is why Signal One treats the digital occurrence book as part of the operating record rather than as a standalone digital notebook.</p>
    </InsightArticle>
  );
}
