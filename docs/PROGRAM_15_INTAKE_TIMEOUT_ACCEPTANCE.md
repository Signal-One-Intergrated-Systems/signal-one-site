# PROGRAM-15 intake timeout acceptance

This is a manual acceptance specification for `submitIntake` in `app/lib/intake.ts`. It does not claim that a LEOS receiver is configured or has accepted a submission. Run only with a separately approved synthetic fixture; never send real customer data or use the production endpoint for these checks.

## Setup

- Use a controlled browser or test harness with `/api/intake` intercepted by a local fake response. Do not configure a real LEOS receiver.
- Use synthetic form values and observe the returned `IntakeResult`, the request abort signal, and the fallback `mailto:` link.
- The client timeout is 15 seconds. No test/build/CI run is implied by this document.

## Cases

| Case | Fake service behavior | Expected result |
| --- | --- | --- |
| Accepted response | Return HTTP 200 with valid JSON `{"message":"Synthetic request received"}`. | `ok: true`; message matches the response. No fallback. |
| Service failure | Return HTTP 503 (also check 500) with valid JSON and a message. | `ok: false`; surface the server message; fallback is populated with the sales email and prefilled `mailto:` link. |
| Stalled request | Keep the intercepted request pending past 15 seconds. | Fetch is aborted; `ok: false`; message says receipt could not be confirmed; fallback is populated. It must never report success. |
| Malformed success response | Return HTTP 200 with invalid JSON. | `ok: false`; message says receipt could not be confirmed; fallback is populated. |
| Network failure | Reject the intercepted fetch before a response. | `ok: false`; network failure message; fallback is populated. |
| Client error | Return HTTP 400 with valid JSON validation text. | `ok: false`; validation text is surfaced; fallback is null. |

## Acceptance

- A 2xx response is reported as success only when its body can be parsed as JSON.
- A timeout or network failure is reported as failure with the existing email fallback.
- A 5xx response is reported as failure with the service message when supplied and with the email fallback.
- No case implies LEOS receipt unless the configured endpoint's valid successful response says so.
- After manually verifying each case with synthetic data and an approved fake receiver, record the result and environment. Tests/builds/Actions remain NOT RUN for this PR.
