#!/bin/bash
# temporary forensic log extraction - will be deleted after use
log show --start '2026-07-29 19:53:00' --end '2026-07-29 19:57:30' --style compact > /tmp/wipe_window.log 2>/tmp/wipe_window.err
echo "exit: $?"
wc -l /tmp/wipe_window.log
head -5 /tmp/wipe_window.err
