# Moderated usability test protocol — Signal One website

Purpose: validate (or overturn) the agent-produced persona hypotheses in `CUSTOMER_JOURNEYS.md` with real prospective customers before and after remediation. Method follows GOV.UK Service Manual guidance on moderated usability testing and NN/g think-aloud practice.

## Participants (5 per round; 5 typically surface most severe problems)

| # | Profile | Screen-in question |
|---|---|---|
| 1 | Security company owner / ops director, 20–300 guards | "Do you currently issue radios or phones to guards on site?" |
| 2 | Procurement or financial manager in a security, facilities or logistics firm | "Do you approve purchases or rentals of field equipment?" |
| 3 | Property / facilities manager | "Do you contract security or manage on-site teams?" |
| 4 | Construction, warehouse or event operations manager | "Do your teams use radios or PTT today?" |
| 5 | Security officer (PSiRA-registered) | "Are you currently employed or seeking work as a guard?" |

Recruit from Signal One's own pipeline and warm network. Obtain POPIA-compliant consent for recording; store recordings outside the repository.

## Session (45 min, remote, participant's own device; at least 2 on mobile)

1. Intro and consent (5 min). "We are testing the website, not you. Please think aloud."
2. First impression (2 min): open https://signalone.co.za, 10 seconds, then hide. "What does this company do? What could you buy from them?"
3. Scenario tasks (25 min), unassisted, in the participant's own words:
   - T1 "Your company has won a 12-site contract and needs 30 radios that work between sites. Find out whether Signal One can help and how you would get a price."
   - T2 "Your finance director asks whether to buy or rent. Find what you'd need to answer them."
   - T3 "Before you send anything, satisfy yourself this is a company you'd trust with a 24-month contract."
   - T4 "You're already a customer and a radio is faulty. What do you do?"
   - T5 (guard) "Find out whether Signal One can help you find work and what it will ask you for."
4. Debrief (8 min): Single Ease Question per task (1–7), "What almost made you leave?", "What was missing?"
5. Close (5 min).

## Measures

- Task success (complete / partial / fail), time on task, wrong-path clicks.
- SEQ per task; verbatim quotes for abandonment triggers and missing information.
- Severity of each problem (0–4, Nielsen) logged to `DEFECT_REGISTER.md` with participant ID, never name.

## Rules

- No leading questions; do not explain the interface.
- Never use real customer data in tasks. Do not let a participant submit a real enquiry unless they genuinely want to.
- Report findings as observed behaviour; keep agent heuristic findings separate.
