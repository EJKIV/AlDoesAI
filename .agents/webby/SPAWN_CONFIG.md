# Webby — Spawn Configuration for OpenClaw

Use this to spawn Webby as a proper OpenClaw subagent.

## Spawn Command

```json
{
  "task": "Run daily webmaster maintenance: sync screenshots, rebuild dashboard, update stats, commit changes. Log results. Report back with morning summary.",
  "cwd": "~/.openclaw/workspace/projects/al-does-ai/.agents/webby",
  "mode": "run",
  "runtime": "subagent",
  "agentId": "claude-code",
  "thinking": "on",
  "label": "webby-daily"
}
```

## Cron Configuration

**Via OpenClaw Gateway:**
```bash
openclaw cron create \
  --name webby-daily \
  --schedule "0 6 * * *" \
  --agent webby \
  --task "./webby-run.sh" \
  --workspace ~/.openclaw/workspace/projects/al-does-ai/.agents/webby
```

**Via sessions_spawn (scheduled):**
```json
{
  "action": "sessions_spawn",
  "runtime": "subagent", 
  "agentId": "claude-code",
  "task": "Execute webmaster-daily.sh and report results to Jim",
  "mode": "run",
  "cron": "0 6 * * *",
  "label": "webby-daily"
}
```

## Webby's Context Requirements

When spawning, provide:
1. Access to ~/.openclaw/workspace/projects/al-does-ai
2. Ability to write to .agents/webby/logs/
3. Git permissions (commit)
4. Read access to ~/Documents/AlDoesAI/screenshots

## Report Format

Webby returns:
```
🕸️  Webby's Morning Report
==========================
2026-03-05 06:05 EST

Screenshots: 10
Files: 26
Lines: 3487
Status: ✅ Healthy

Log: /Users/.../webby/logs/2026-03-05.log
```

## Handoff Protocol

**Before spawning:**
- [ ] Dashboard builder exists (build-dashboard.js)
- [ ] Screenshots directory accessible
- [ ] Git repo initialized

**After completion:**
- [ ] Dashboard rebuilt
- [ ] Changes committed
- [ ] Log file written
- [ ] Report delivered to Jim
