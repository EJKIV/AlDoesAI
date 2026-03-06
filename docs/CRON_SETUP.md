# Cron Setup for Al Does AI

This document explains how to configure automated daily updates for the Al Does AI project using macOS `cron`.

---

## Overview

The cron system runs two automated tasks daily at 7:31 PM EST:

1. **JournalWriter** — Generates the daily journal from memory files
2. **GuideBuilder** — Rebuilds documentation guide pages

---

## Prerequisites

- macOS (tested on Sonoma)
- Terminal access
- Project checked out at `~/.openclaw/workspace/projects/al-does-ai`

---

## Step 1: Edit Your Crontab

Open your crontab for editing:

```bash
crontab -e
```

---

## Step 2: Add the Cron Entries

Paste these lines into your crontab:

```
# Al Does AI — Daily Automation
# Runs at 7:31 PM EST every day
31 19 * * * /bin/bash -l -c "cd ~/.openclaw/workspace/projects/al-does-ai && ./scripts/daily-journal.sh >> logs/cron.log 2>&1"
31 19 * * * /bin/bash -l -c "cd ~/.openclaw/workspace/projects/al-does-ai && ./scripts/update-guide.sh >> logs/cron.log 2>&1"
```

**Note:** Use `-l` (login shell) to ensure PATH and environment variables are loaded correctly.

---

## Step 3: Alternative: Single Entry (Wrapper)

If you prefer a single cron job:

```
31 19 * * * /bin/bash -l -c "cd ~/.openclaw/workspace/projects/al-does-ai && ./scripts/openclaw-cron.sh >> logs/cron.log 2>&1"
```

---

## Step 4: Save and Exit

- Press `Ctrl+X` → `Y` → `Enter` (if using nano)
- Or `Esc` → `:wq` → `Enter` (if using vim)

---

## Step 5: Verify Your Crontab

List your current crontab entries:

```bash
crontab -l
```

You should see the entries you just added.

---

## Step 6: Test the Scripts Manually

Before relying on cron, test the scripts:

### Test Journal Generation:
```bash
cd ~/.openclaw/workspace/projects/al-does-ai
./scripts/test-journal.sh
```

### Test Guide Rebuild:
```bash
./scripts/test-guide.sh
```

### Test Cron Environment Simulation:
```bash
./scripts/test-cron.sh
```

---

## Cron Time Format

The cron expression `31 19 * * *` means:

| Field | Value | Meaning |
|-------|-------|---------|
| Minute | 31 | At minute 31 |
| Hour | 19 | At 7 PM (24-hour format) |
| Day | * | Every day |
| Month | * | Every month |
| Weekday | * | Every day of week |

**Examples:**
- `31 19 * * *` — Every day at 7:31 PM
- `0 9 * * *` — Every day at 9:00 AM
- `0 9 * * 1` — Every Monday at 9:00 AM
- `*/30 * * * *` — Every 30 minutes

---

## Debugging

### Check If Cron Is Running

```bash
sudo launchctl list | grep cron
```

You should see:
```
-    0    com.vix.cron
```

### View Cron Logs

macOS cron logs to system log. View with:

```bash
grep -i cron /var/log/system.log
```

Or simply check the project logs:

```bash
tail -f ~/.openclaw/workspace/projects/al-does-ai/logs/cron.log
tail -f ~/.openclaw/workspace/projects/al-does-ai/logs/journal.log
tail -f ~/.openclaw/workspace/projects/al-does-ai/logs/guide.log
```

### Test Your Commands First

Cron runs with a minimal environment. Always test:

```bash
# From a clean shell (simulates cron)
env -i HOME=$HOME PATH=/usr/bin:/bin bash -c "cd ~/.openclaw/workspace/projects/al-does-ai && ./scripts/daily-journal.sh"
```

### Common Issues

| Issue | Solution |
|-------|----------|
| `command not found` | Use full paths or run via `/bin/bash -l` |
| Permission denied | Run `chmod +x scripts/*.sh` |
| Home directory not found | Ensure `HOME` is set in environment |
| Scripts don't run | Check that PATH includes script locations |

---

## File Locations

```
~/.openclaw/workspace/projects/al-does-ai/
├── scripts/
│   ├── daily-journal.sh       # Journal generator
│   ├── update-guide.sh        # Guide rebuild
│   ├── openclaw-cron.sh       # Cron wrapper
│   ├── test-journal.sh        # Manual test
│   ├── test-guide.sh          # Manual test
│   └── test-cron.sh           # Cron simulation
├── logs/
│   ├── cron.log               # Cron execution log
│   ├── journal.log            # Journal generation log
│   └── guide.log              # Guide build log
├── docs/                      # Source documentation
├── journal/                   # Generated journal HTML
└── guide/                     # Generated guide HTML
```

---

## Useful Commands

```bash
crontab -e    # Edit crontab
crontab -l    # List crontab
crontab -r    # Remove all entries (be careful!)
man crontab   # Read manual
man 5 crontab # Read format documentation
```

---

## Temporarily Disable

Comment out entries with `#`:

```
# 31 19 * * * /bin/bash -l -c "cd ~/.openclaw/workspace/projects/al-does-ai && ./scripts/daily-journal.sh >> logs/cron.log 2>&1"
```

Or remove all entries:

```bash
crontab -r
```

---

## Timezone Consideration

Cron runs in your user's timezone. To check:

```bash
date
```

The 7:31 PM EST schedule assumes your macOS timezone is Eastern. If you're in a different timezone, adjust accordingly:

| Your Timezone | Cron Entry |
|---------------|------------|
| EST/EDT | `31 19 * * *` (7:31 PM) |
| PST/PDT | `31 16 * * *` (4:31 PM) |
| UTC | `31 0 * * *` (12:31 AM next day) |

---

## Manual Trigger

To run scripts manually outside of schedule:

```bash
cd ~/.openclaw/workspace/projects/al-does-ai

# Just journal
./scripts/daily-journal.sh

# Just guide
./scripts/update-guide.sh

# Both (simulates cron)
./scripts/test-cron.sh
```

---

## Troubleshooting Checklist

- [ ] Cron service is running (`sudo launchctl list | grep cron`)
- [ ] Crontab entries are saved (`crontab -l`)
- [ ] Scripts are executable (`ls -la scripts/*.sh`)
- [ ] Scripts work manually (`./scripts/test-journal.sh`)
- [ ] Logs directory exists (`ls -la logs/`)
- [ ] Path to project is correct (expand `~` to full path in crontab if needed)
- [ ] Environment variables loaded (using `/bin/bash -l`)

---

## Security Notes

- Cron jobs run as your user account
- No sudo or root required
- Scripts have no network access except git operations
- No API keys stored in these scripts

---

## Related Documentation

- [30_DAY_PLAN.md](./30_DAY_PLAN.md) — Project roadmap
- [AUTOMATION_WORKFLOWS.md](./AUTOMATION_WORKFLOWS.md) — Automation details
- [AGENT_TEAM_ROSTER.md](./AGENT_TEAM_ROSTER.md) — Agent specifications

---

## Support

Questions or issues? Check:
1. Logs in `logs/` directory
2. Run manual tests first
3. Review this troubleshooting guide

---

**Last Updated:** Auto-generated by CronSetup agent  
**Schedule:** Daily at 7:31 PM EST