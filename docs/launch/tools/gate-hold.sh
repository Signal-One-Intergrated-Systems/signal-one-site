#!/usr/bin/env bash
# Usage: gate-hold.sh <AGENT> <purpose> <max-minutes> <script> [args...]
# Waits for /tmp/claude-0/leos-gate.lock, records the owner, runs <script> under a hard time limit,
# and always releases. A run killed by the limit exits 124 and is NEVER a pass (record it as inconclusive).
# It does not change what the gate checks; it only bounds how long one holder can keep the lock.
set -u
AGENT=$1; PURPOSE=$2; MAXMIN=$3; shift 3
LOCK=/tmp/claude-0/leos-gate.lock; OWNER=/tmp/claude-0/leos-gate.owner
COORD=/tmp/claude-0/-home-user/880ad5ad-058b-5c40-9bba-4c19903c0d78/scratchpad/coord/COORDINATION.md
exec 9>>"$LOCK"
echo "- $(date -u +%FT%TZ) $AGENT: QUEUED for leos-gate.lock ($PURPOSE, limit ${MAXMIN}m)" >> "$COORD"
flock 9
printf 'agent=%s\npid=%s\nstart=%s\nlimit_min=%s\npurpose=%s\ncwd=%s\n' "$AGENT" "$$" "$(date -u +%FT%TZ)" "$MAXMIN" "$PURPOSE" "$PWD" > "$OWNER"
echo "- $(date -u +%FT%TZ) $AGENT: gate lock ACQUIRED ($PURPOSE)" >> "$COORD"
timeout --kill-after=60 "${MAXMIN}m" "$@" 9>&-
RC=$?
[ $RC -eq 124 ] && echo "- $(date -u +%FT%TZ) $AGENT: TIME LIMIT ${MAXMIN}m hit — run killed, result INCONCLUSIVE (not a pass)" >> "$COORD"
rm -f "$OWNER"
echo "- $(date -u +%FT%TZ) $AGENT: gate lock RELEASED ($PURPOSE) RC=$RC" >> "$COORD"
exit $RC
