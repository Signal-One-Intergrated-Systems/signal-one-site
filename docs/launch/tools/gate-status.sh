#!/usr/bin/env bash
# Read-only: who holds leos-gate.lock, for how long, who waits, and whether the holder looks stale.
LOCK=/tmp/claude-0/leos-gate.lock; OWNER=/tmp/claude-0/leos-gate.owner
now=$(date +%s)
echo "now $(date -u +%FT%TZ)"
lslocks -o PID,MODE,PATH 2>/dev/null | awk -v L="$LOCK" '$NF==L' | while read pid mode path; do
  st=$(ps -o lstart= -p $pid 2>/dev/null); el=$(ps -o etimes= -p $pid 2>/dev/null)
  role=HOLDER; case $mode in *'*'*) role=WAITING;; esac
  echo "$role pid=$pid age=$(( ${el:-0}/60 ))m cwd=$(readlink /proc/$pid/cwd 2>/dev/null) cmd=$(ps -o args= -p $pid | cut -c1-140)"
  if [ $role = HOLDER ]; then
    newest=$(find /proc/$pid/cwd/ /tmp/claude-0/-home-user/880ad5ad-058b-5c40-9bba-4c19903c0d78/scratchpad -maxdepth 4 -name '*.log' -newermt "-15 minutes" 2>/dev/null | head -1)
    kids=$(pgrep -P $pid | wc -l)
    [ -z "$newest" ] && echo "  WARN: no .log written in the last 15 min (possible stall)"
    [ "$kids" -eq 0 ] && echo "  WARN: holder has no child process (possible orphaned hold)"
    acq=$(grep -h "gate lock ACQUIRED" /tmp/claude-0/-home-user/880ad5ad-058b-5c40-9bba-4c19903c0d78/scratchpad/coord/COORDINATION.md | tail -1)
    echo "  last ACQUIRED line: ${acq:0:160}"
    a=$(echo "$acq" | grep -o '20[0-9-]*T[0-9:]*Z' | head -1); [ -n "$a" ] && h=$(( (now - $(date -d "$a" +%s))/60 )) && echo "  held for ~${h}m (process age includes queue wait)" && [ $h -gt 75 ] && echo "  WARN: held over 75 min"
  fi
done
[ -f $OWNER ] && { echo "owner record:"; sed 's/^/  /' $OWNER; o=$(sed -n 's/^pid=//p' $OWNER); kill -0 $o 2>/dev/null || echo "  STALE: owner pid $o is dead (lock is released by the kernel; remove the record)"; }
exit 0
