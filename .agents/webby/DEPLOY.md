# Deploy Webby — OpenClaw Agent

## Quick Start

```bash
# 1. Make Webby executable
cd ~/.openclaw/workspace/projects/al-does-ai/.agents/webby
chmod +x webby-run.sh

# 2. Test Webby manually
./webby-run.sh

# 3. Schedule Webby via OpenClaw
openclaw agent create-webby
```

## Setup OpenClaw Cron

### Method 1: sessions_spawn (Recommended)

**Create a scheduled spawn:**

This requires OpenClaw Gateway to support cron scheduling. If not available, use Method 2.

### Method 2: External Cron (Current)

**Add to system crontab:**
```bash
# Edit crontab
crontab -e

# Add Webby's daily run
0 6 * * * /Users/alariceverett/.openclaw/workspace/projects/al-does-ai/.agents/webby/webby-run.sh >> /Users/alariceverett/.openclaw/workspace/projects/al-does-ai/.agents/webby/logs/cron.log 2>&1
```

**Verify:**
```bash
# Check cron jobs
crontab -l

# Force run (test)
~/.openclaw/workspace/projects/al-does-ai/.agents/webby/webby-run.sh

# Check logs
ls -la ~/.openclaw/workspace/projects/al-does-ai/.agents/webby/logs/
```

## Webby's Identity

| Property | Value |
|----------|-------|
| Name | Webby |
| Emoji | 🕸️ |
| Role | Webmaster |
| Schedule | Daily 6:00 AM EST |
| Reports to | Jim (you) |
| Team | Al Does AI |

## Communication

**Webby reports:**
- Daily morning summary (6:05 AM)
- Immediate alerts for errors
- Weekly digest (sundays)

**You can ask:**
- "Webby, status" → Current health
- "Webby, logs" → Recent activity
- "Webby, run now" → Manual execution

## Files

| File | Purpose |
|------|---------|
| `IDENTITY.md` | Who Webby is |
| `SOUL.md` | How Webby thinks |
| `USER.md` | Your guide to Webby |
| `webby-run.sh` | Daily execution script |
| `agent-config.json` | Permissions & scope |
| `logs/*.log` | Daily activity logs |

## Verification Checklist

- [ ] Webby executable (chmod +x)
- [ ] Log directory exists
- [ ] Test run successful
- [ ] Cron job installed
- [ ] First run logged
- [ ] Dashboard updated
- [ ] Jim notified

---

**Webby status:** Ready for deployment 🕸️
