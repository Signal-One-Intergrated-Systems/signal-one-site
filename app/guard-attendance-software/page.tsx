import type { Metadata } from "next";
import LandingPage from "../components/LandingPage";
import { ButtonLink, FactPanel } from "../components/ui";
import { guardDayPricePhrase } from "../lib/pricing";

export const metadata: Metadata = {
  title: "Guard Attendance and Clock-In Software",
  description:
    "Clock-in at the post on the guard's phone or a Central Device, the roster against every post, and PSiRA rules built in. " + guardDayPricePhrase + ", excl. VAT.",
  alternates: { canonical: "/guard-attendance-software" },
};

export default function GuardAttendanceSoftwarePage() {
  return (
    <LandingPage
      kicker="Guard attendance and clock-in"
      title="Know who is on post, and prove it."
      lead="Guards clock in and out at the post on their own phone or an authorised Central Device. The roster shows which posts are short before the shift starts, and every attendance record feeds proof of service."
      actions={
        <>
          <ButtonLink href="/contact" size="lg">
            Talk to Signal One
          </ButtonLink>
          <ButtonLink href="/pricing#calculator" variant="ghost-dark" size="lg">
            Calculate guard cost
          </ButtonLink>
        </>
      }
      aside={
        <FactPanel
          title="Signal One Guard · attendance"
          facts={[
            ["Clock in at the post", "On the guard's own phone or an authorised Central Device."],
            ["Against the shift and post", "The attendance record belongs to the shift and the post."],
            ["PSiRA rules built in", "A missing or expired registration blocks the assignment."],
            ["No signal", "Clock-in and clock-out are saved on the phone and sent when signal returns."],
          ]}
        />
      }
      capabilitiesTitle="Attendance as a record, not a timesheet"
      capabilities={[
        ["Clock in and out at the post", "The attendance record belongs to the shift and the post, not to a sheet typed up later."],
        ["The roster against every post", "Sites, posts and shifts, with shortfalls visible before the shift starts."],
        ["Guards on duty now", "See who is clocked in across your sites."],
        ["PSiRA rules built in", "Each officer's PSiRA number, grade and expiry are recorded. A missing or expired registration blocks the assignment. Only a grade mismatch can be overridden, and every override is logged with a reason. Signal One does not check registrations with PSiRA itself."],
        ["Works offline", "Clock-in and clock-out are saved on the phone and sent when signal returns."],
        ["Attendance as evidence", "Each scheduled service is marked proven, partly proven, unresolved or not proven, with the reason, for example attendance verified at both ends."],
      ]}
      stepsTitle="From roster to proof"
      steps={[
        ["Set up sites, posts and shifts", "Build the roster for each site."],
        ["Allocate guards", "Assign officers to posts. PSiRA rules apply to every assignment."],
        ["The guard clocks in", "At the post, on their own phone or an authorised Central Device."],
        ["Supervisors see shortfalls", "Posts that are short, and late arrivals, wait for action."],
        ["The proof is generated", "Attendance feeds proof of service, which you or your client can turn into a report for the period."],
      ]}
      limits={[
        "Payroll is coming soon. Attendance is not yet exported to payroll.",
        "PSiRA details are recorded as you enter them. Signal One does not verify them with PSiRA.",
      ]}
      closing="Attendance you can show your client."
      related={[
        ["/guard-patrol-software", "Guard patrol software"],
        ["/solutions/security", "The Signal One Security platform"],
        ["/pricing", "Pricing: " + guardDayPricePhrase],
      ]}
    />
  );
}
