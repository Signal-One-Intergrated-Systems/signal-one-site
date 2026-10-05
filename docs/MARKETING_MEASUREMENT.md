# Signal One Marketing Measurement

The public site now emits anonymous first-party marketing events to `/api/marketing-event`.

No persistent browser identifier or advertising script is added by this implementation.

## Events

### page_view

Emitted when the Next.js pathname changes.

Fields:
- event
- path
- referrer
- utmSource
- utmMedium
- utmCampaign
- utmTerm
- utmContent

### buyer_click

Emitted for buyer-path links including:
- Product tour
- Packages
- Trust
- Contact / demo
- Marketplace
- Company onboarding
- Security workflow pages

Additional fields:
- href
- label

## Server configuration

If no analytics destination is configured, the endpoint returns HTTP 204 and the buyer experience is unaffected.

To forward events, configure:

- `SIGNAL_ONE_ANALYTICS_URL`
- `SIGNAL_ONE_ANALYTICS_TOKEN` (optional bearer token)

The server adds:
- source = signal-one-site
- receivedAt = server timestamp

## Lead attribution

Client enquiry forms separately capture:
- buyer intent
- UTM source
- UTM medium
- UTM campaign
- UTM term
- UTM content
- landing path
- referrer
- configured marketplace quote where applicable

These fields are forwarded through the existing `/api/intake` integration.

## Funnel to report

Recommended stages:

1. Organic / campaign landing.
2. Product tour viewed.
3. Packages viewed.
4. Trust / procurement page viewed.
5. Demo / pricing / pilot enquiry started.
6. Enquiry submitted.
7. Qualified opportunity.
8. Pilot.
9. Live customer.

Website analytics should ultimately be reconciled with Sales OS / CRM opportunity data so campaign performance is measured against qualified pipeline and revenue, not only page views.
