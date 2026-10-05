import type { Metadata } from "next";
import SecurityIntentPage from "../../../components/SecurityIntentPage";

export const metadata: Metadata = {
  title: "Security Guard Attendance System South Africa",
  description:
    "Record security guard attendance against the operational site with Signal One Guard clock-in, clock-out, geofence policy and preserved evidence.",
};

export default function AttendancePage() {
  return (
    <SecurityIntentPage
      eyebrow="Security guard attendance system · South Africa"
      title="Know who is actually on site, not only who was scheduled."
      body="Signal One Guard records clock-in and clock-out against the operational site, supports geofence policy and preserves attendance as part of the wider service record."
      image="/images/logistics.jpg"
      imageAlt="Field supervisor using communications equipment on an operating site"
      outcomeTitle="Turn attendance into an operational fact the rest of the system can use."
      outcomeBody="A roster says who should be at the post. Attendance evidence helps management understand who was actually present and gives coverage, patrol and service-proof workflows a stronger operational foundation."
      features={[
        { title: "Clock-in & clock-out", body: "Capture the start and end of an officer's attendance against the operating site." },
        { title: "Site context", body: "Tie attendance to the location where the service is being delivered rather than storing it as an isolated time entry." },
        { title: "Geofence policy", body: "Apply geofence policy to attendance where the operating model requires location-aware verification." },
        { title: "Preserved history", body: "Keep attendance evidence within the operational record used for oversight and service proof." },
      ]}
      proofTitle="Attendance becomes more useful when it connects to coverage and the rest of the shift."
      proofBody="Signal One is designed so verified presence can sit alongside post coverage, patrol activity, incidents and other events instead of becoming another disconnected timesheet."
      proofImage="/images/product-proof/proof-of-service-demo.jpg"
      proofImageAlt="Signal One Guard proof of service demo interface"
      faqs={[
        { question: "Does Signal One support guard clock-in and clock-out?", answer: "Yes. The Guard product supports attendance recorded against the operational site." },
        { question: "Can attendance use geofencing?", answer: "The public product supports geofence policy as part of the attendance workflow." },
        { question: "Does attendance replace payroll?", answer: "The public Signal One website does not claim payroll processing. Payroll or payroll integration requirements should be confirmed separately during evaluation." },
        { question: "How does attendance support client proof?", answer: "Attendance evidence forms part of the same operational record that can support management oversight and authorised client-facing service proof." },
      ]}
    />
  );
}
