# Exact benchmark-access configuration

The task-bound managed runtime currently reports enforced **revision 24**, current observations and `network_policy.allowed_hosts: []`. Revision 21 had the same restriction. The transient upstream file-download 503 did not change local code: the clean checkout and remote mission branch were verified at `09ba68fdff5930b8775ab7aa6d1067a9641aa7ae`, and the independent PR review was recovered through the GitHub connector. Existing screenshots and recordings were used locally.

Update the network settings of this **executing cloud environment**, rather than only a project, browser, or unrelated runtime:

```text
environment_id: ccarenv_b64_Y2NhcmVudl8zNDI3YmRjZDhjYzA4MTkxYWFlNzU0MmRkMDg5Y2M3OQ
```

Keep restricted mode and the package-manager preset, and add these custom allowed hosts:

```json
[
  "atexsolutions.io",
  "www.atexsolutions.io",
  "signalone.co.za",
  "www.signalone.co.za",
  "atex-experience-preview-production.up.railway.app"
]
```

The exact preview hostname is sufficient; `*.up.railway.app` can cover other approved Railway previews if the environment configuration supports that wildcard. If ATEX requires additional asset hosts, add only the specific hosts revealed by browser requests after the main page becomes reachable. They are currently unknown.

Apply the environment configuration, then confirm through `cloud_environment.environment_status` that observations are current, the new revision is enforced, and the destinations appear in `effective_allowed_hosts`. Retry Chromium at 390/768/1440 through the inherited HTTPS proxy with normal TLS validation. Inspect the full reference interactions and final preview before making any benchmark acceptance claim.

The current tools expose policy inspection, not environment-policy mutation. Editing `/etc/codex/network-policy.json` cannot grant access: the sidecar enforces it. No direct-connection or proxy bypass was attempted. Until this configuration takes effect, the live ATEX/public-site/preview comparison remains blocked and refinement continues locally.
