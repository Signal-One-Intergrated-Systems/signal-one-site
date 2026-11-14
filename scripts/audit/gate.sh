#!/usr/bin/env bash
# Audit helper: runs the whole release gate and records each step with its exit code and Node version.
# Usage: scripts/audit/gate.sh <log-dir> <label> [node-bin-dir]
set -u
LOGDIR="$1"; LABEL="$2"; NODEBIN="${3:-}"
[ -n "$NODEBIN" ] && export PATH="$NODEBIN:$PATH"
mkdir -p "$LOGDIR"
SUMMARY="$LOGDIR/$LABEL-00-summary.log"
: > "$SUMMARY"
step() { # name, command...
  local name="$1"; shift
  local log="$LOGDIR/$LABEL-$name.log"
  { echo "## HEAD $(git rev-parse HEAD)"; echo "## node $(node -v) | npm $(npm -v) | $(date -u)"; echo "## \$ $*"; } > "$log"
  "$@" >> "$log" 2>&1
  local code=$?
  echo "EXIT_CODE=$code" >> "$log"
  echo "$name | node $(node -v) | exit $code | $(grep -E '^\s+[0-9]+ (passed|failed|flaky|skipped)|^# (pass|fail) |^ℹ (pass|fail) ' "$log" | tr -s ' ' | tr '\n' ';')" | tee -a "$SUMMARY"
}
# Stops only what listens on this repository's own test ports (never "every Next.js server on the machine").
# 3100-3102 and 4010 are the default Playwright config's servers; 4334 is the server this script starts.
stop_ports() {
  local port pid
  for port in "$@"; do
    for pid in $( (fuser "$port/tcp" 2>/dev/null || lsof -ti "tcp:$port" -sTCP:LISTEN 2>/dev/null) | tr -s ' \n' ' '); do
      kill "$pid" 2>/dev/null
    done
  done
}
{ echo "## HEAD $(git rev-parse HEAD)"; echo "## node $(node -v) | $(date -u)"; } >> "$SUMMARY"
stop_ports 3100 3101 3102 4010 4334
step 01-lint npm run lint
step 02-build env NEXT_TELEMETRY_DISABLED=1 npm run build
step 03-tsc npx tsc --noEmit
step 04-playwright-default env CI=1 npx playwright test
step 05-node-test-connect node --test ${NODE_TEST_FLAG:---test-isolation=none} tests/connect/*.test.mjs
stop_ports 3100 3101 3102 4010 4334; sleep 1
(npx next start -p 4334 > "$LOGDIR/$LABEL-next-4334.log" 2>&1 &)
for i in $(seq 1 60); do curl -s -o /dev/null http://127.0.0.1:4334/api/connect-status && break; sleep 1; done
step 06-playwright-connect npx playwright test --config playwright.connect.config.ts
step 07-playwright-live-loopback env CONNECT_LIVE_TEST_BASE=http://127.0.0.1:4334 EXPECTED_RELEASE=local npx playwright test --config playwright.live.config.ts
stop_ports 4334
echo "GATE DONE $(date -u)" >> "$SUMMARY"
