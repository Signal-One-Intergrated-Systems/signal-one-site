# Contrast audit

Every text and background pair in use on the public routes at 1440px and 390px, measured in the rendered pages (computed colours composited over the real background stack; text over photographs is measured against the lightest and darkest 2% of the pixels behind it with the text hidden). Thresholds: 4.5:1 for normal text, 3:1 for large text (24px, or 18.66px bold). WCAG exempts logotypes, so the lockup wordmark is marked.

53 unique pairs, 2290 text elements.

| Text | Background | Size | Min ratio | Needs | Result | Elements | Example (route) |
|---|---|---|---|---|---|---|---|
| `#0EA5E9` | `#F5F7FA` | large | 2.58 | 3.0 | exempt: logotype | 6 | ONE (/guards) |
| `#0284C7` | `#F5F7FA` | large | 3.82 | 3.0 | pass | 20 | R2 (/) |
| `#0284C7` | `#FFFFFF` | large | 4.10 | 3.0 | pass | 4 | R1 200 (/) |
| `#0270A8` | `#E9EEF4` | normal | 4.63 | 4.5 | pass | 4 | Equip (/) |
| `#5A7184` | `#F5F7FA` | normal | 4.74 | 4.5 | pass | 6 | INTEGRATED SYSTEMS (/guards) |
| `#0270A8` | `#E6F4FB` | normal | 4.81 | 4.5 | pass | 6 | By quote (/) |
| `#0270A8` | `#F5F7FA` | normal | 5.04 | 4.5 | pass | 28 | The problem (/) |
| `#0270A8` | `#F5F7FA` | large | 5.04 | 3.0 | pass | 28 | 1 (/guard-marketplace) |
| `#0270A8` | `#FFFFFF` | normal | 5.40 | 4.5 | pass | 14 | On site (/solutions/security) |
| `#0270A8` | `#FFFFFF` | large | 5.40 | 3.0 | pass | 8 | 1 (/radios-equipment) |
| `#F1F5F9` | `photo, worst pixel` | large | 5.55 | 3.0 | pass | 4 | Won the contract? Staff it. (/) |
| `#166534` | `#E5F2E9` | normal | 6.18 | 4.5 | pass | 2 | Live (/guard-marketplace) |
| `#92400E` | `#FBF0DC` | normal | 6.28 | 4.5 | pass | 6 | Illustrative demo · syntheti (/guard-marketplace) |
| `#38BDF8` | `#272C32` | normal | 6.56 | 4.5 | pass | 2 | By quote (/radios-equipment) |
| `#94A3B8` | `#151A21` | normal | 6.82 | 4.5 | pass | 50 | INTEGRATED SYSTEMS (/) |
| `#0B1118` | `#0EA5E9` | normal | 6.84 | 4.5 | pass | 52 | See Signal One in action (/) |
| `#94A3B8` | `#0A0D12` | normal | 7.59 | 4.5 | pass | 5 | Synthetic demo data (/) |
| `#38BDF8` | `#151A21` | large | 8.16 | 3.0 | pass | 52 | ONE (/) |
| `#38BDF8` | `photo, worst pixel` | normal | 8.16 | 4.5 | pass | 4 | Hire (/) |
| `#38BDF8` | `#151A21` | normal | 8.16 | 4.5 | pass | 14 | See how Marketplace will wor (/) |
| `#33475B` | `#E9EEF4` | normal | 8.21 | 4.5 | pass | 26 | Tell us the sites, quantitie (/) |
| `#374151` | `#E8E9EC` | normal | 8.49 | 4.5 | pass | 4 | Coming soon (/radios-equipment) |
| `#D1D5DB` | `#2E333C` | normal | 8.59 | 4.5 | pass | 2 | Coming soon (/) |
| `#38BDF8` | `#0F131A` | normal | 8.69 | 4.5 | pass | 6 | For growing South African se (/) |
| `#38BDF8` | `#0F131A` | large | 8.69 | 3.0 | pass | 2 | Prove the service. (/) |
| `#33475B` | `#F5F7FA` | normal | 8.92 | 4.5 | pass | 199 | Then the questions start, us (/) |
| `#6EE7A0` | `#272C32` | normal | 9.10 | 4.5 | pass | 8 | Live (/) |
| `#6EE7A0` | `photo, worst pixel` | normal | 9.20 | 4.5 | pass | 2 | Live (/) |
| `#CBD5E1` | `photo, worst pixel` | normal | 9.48 | 4.5 | pass | 4 | Illustrative scene · fiction (/) |
| `#D1D5DB` | `#272C32` | normal | 9.54 | 4.5 | pass | 2 | Coming soon (/solutions/security) |
| `#33475B` | `#FFFFFF` | normal | 9.58 | 4.5 | pass | 157 | Each officer's PSiRA number, (/) |
| `#FCD47A` | `#272C32` | normal | 9.93 | 4.5 | pass | 2 | MVP in development (/guard-marketplace) |
| `#FCD47A` | `photo, worst pixel` | normal | 10.04 | 4.5 | pass | 2 | Guard Marketplace · MVP in d (/) |
| `#CBD5E1` | `#1C222B` | normal | 10.77 | 4.5 | pass | 16 | Coming soon Live map, clock- (/) |
| `#CBD5E1` | `#151A21` | normal | 11.77 | 4.5 | pass | 551 | For guards (/) |
| `#CBD5E1` | `#151A21` | large | 11.77 | 3.0 | pass | 4 | × (/pricing) |
| `#CBD5E1` | `#0F131A` | normal | 12.54 | 4.5 | pass | 16 | One operating system for gua (/) |
| `#F1F5F9` | `#1C222B` | normal | 14.60 | 4.5 | pass | 40 | Contract won (/) |
| `#F1F5F9` | `#1C222B` | large | 14.60 | 3.0 | pass | 16 | Your security company sees (/) |
| `#0B1B2B` | `#E9EEF4` | large | 14.93 | 3.0 | pass | 10 | Radios, PTT, tracking and bo (/) |
| `#0B1B2B` | `#E9EEF4` | normal | 14.93 | 4.5 | pass | 54 | Hytera PNC360S (/) |
| `#F1F5F9` | `#151A21` | large | 15.95 | 3.0 | pass | 70 | SIGNAL ONE (/) |
| `#F1F5F9` | `#151A21` | normal | 15.95 | 4.5 | pass | 211 | Platform (/) |
| `#FFFFFF` | `#1C222B` | normal | 15.99 | 4.5 | pass | 4 | Explore the platform (/) |
| `#0B1B2B` | `#F5F7FA` | normal | 16.23 | 4.5 | pass | 183 | Skip to content (/) |
| `#0B1B2B` | `#F5F7FA` | large | 16.23 | 3.0 | pass | 107 | Winning the contract is only (/) |
| `#0B1B2B` | `#F9FAFC` | normal | 16.70 | 4.5 | pass | 2 | Filters (/guard-marketplace) |
| `#F1F5F9` | `#0F131A` | large | 16.99 | 3.0 | pass | 8 | Win more contracts.Run every (/) |
| `#0B1B2B` | `#FFFFFF` | normal | 17.41 | 4.5 | pass | 200 | PSiRA rules are built in (/) |
| `#0B1B2B` | `#FFFFFF` | large | 17.41 | 3.0 | pass | 52 | Calculate your guard cost (/) |
| `#FFFFFF` | `#151A21` | normal | 17.48 | 4.5 | pass | 6 | R2 per guard per day (/solutions/security) |
| `#F1F5F9` | `#0A0D12` | normal | 17.76 | 4.5 | pass | 5 | Control room (/) |
| `#FFFFFF` | `#0F131A` | normal | 18.61 | 4.5 | pass | 4 | Calculate guard cost · R2 pe (/) |
