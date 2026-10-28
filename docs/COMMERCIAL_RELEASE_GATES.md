# Commercial release acceptance

This checklist is a release gate, not a declaration of completion.

## Verified limitations

- Railway production website is linked to main.
- The production website has no configured SIGNAL_ONE_INTAKE_URL. Forms therefore cannot deliver leads automatically.
- A working checkout, invoicing, credit reconciliation and automatic tenant creation have not been verified.
- Sales OS is an internal tool and must never be marketed as a client workspace.

## Required tests before general availability

1. Submit each public form; validate durable receipt, deduplication, and sales assignment.
2. Create quote, accept approved terms, and calculate VAT consistently.
3. Process test payment, failure, refund, and duplicate webhook through the approved processor.
4. Reconcile the payment and guard-day balance against the financial source of record.
5. Provision company exactly once; invite administrator; verify tenant isolation.
6. Complete a physical-device first shift including clock-in, patrol and occurrence.
7. Verify supervisor and client evidence views show only authorised sites.
8. Test connectivity loss, restoration, support escalation and operational recovery.
9. Pass browser, mobile responsiveness, branding, accessibility and performance checks.
10. Obtain legal review and founder release approval before accepting unrestricted purchases.

## Pricing policy

The website uses R2.00 per guard per day excluding VAT. R2.50 is not approved. The approved terms must cover partial shifts, overnight shifts, relief guards, no-shows, refunds, disputes and rollover.

## Release rule

Preview may ship after successful QA. General availability cannot ship until the above tests and independent contractual and financial approvals pass.
