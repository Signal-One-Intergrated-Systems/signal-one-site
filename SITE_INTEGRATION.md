# Signal One Site — integration notes

The public website is an acquisition and commerce surface, not a second system of record.

- Company onboarding hands off to Signal One's internal customer and operational services.
- Sales applications hand off to Signal One for review, workforce setup, training and Sales OS access.
- Guard applications hand off to Signal One for verification before operational access is created.
- Public marketplace catalogue data is website-owned until a Signal One commerce API replaces it.

## Runtime adapters

\`POST /api/intake\` forwards \`client\`, \`sales\` and \`guard\` applications to \`SIGNAL_ONE_INTAKE_URL\`.

Credentials stay in server-side environment variables and never go to the browser.
