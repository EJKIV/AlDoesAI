#!/bin/bash
# Webby's daily run — called by OpenClaw cron or spawn

AGENT_DIR="$HOME/.openclaw/workspace/projects/al-does-ai/.agents/webby"
PROJECT_DIR="$HOME/.openclaw/workspace/projects/al-does-ai"
LOG_FILE="$AGENT_DIR/logs/$(date +%Y-%m-%d).log"

# Webby's log format: timestamp, event, details
log() {
    echo "[$(date '+%H:%M:%S')] $1 | $2" | tee -a "$LOG_FILE"
}

read_soul() {
    # Webby reads their soul before working
    if [ -f "$AGENT_DIR/SOUL.md" ]; then
        SOUL_LINE=$(grep -m1 "^_.*_" "$AGENT_DIR/SOUL.md" | tr -d '_')
        echo "$SOUL_LINE"
    fi
}

cd "$PROJECT_DIR" || exit 1

# Webby's morning begins
log "BEGIN" "Daily maintenance starting"

# 1. Screenshot sync
log "TASK" "Syncing screenshots"
if [ -d "$HOME/Documents/AlDoesAI/screenshots" ]; then
    NEW=$(find "$HOME/Documents/AlDoesAI/screenshots" -type f -name "*.png" 2>/dev/null | wc -l)
    CURRENT=$(find "$PROJECT_DIR/assets/screenshots" -type f -name "*.png" 2>/dev/null | wc -l)
    
    if [ "$NEW" -gt "$CURRENT" ]; then
        cp "$HOME/Documents/AlDoesAI/screenshots"/*.png "$PROJECT_DIR/assets/screenshots/" 2>/dev/null
        log "SYNC" "$((NEW - CURRENT)) new screenshots added"
    else
        log "SYNC" "No new screenshots"
    fi
else
    log "SYNC" "Source folder not found"
fi

# 2. Stats update
log "TASK" "Updating statistics"
FILES=$(find "$PROJECT_DIR" -type f ! -path "*/.git/*" | wc -l)
LINES=$(find "$PROJECT_DIR" -type f \( -name "*.md" -o -name "*.html" \) ! -path "*/.git/*" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
SCREENS=$(ls "$PROJECT_DIR/assets/screenshots"/*.png 2>/dev/null | wc -l)

cat > "$PROJECT_DIR/stats.json" << EOF
{
  "prompts": $(ls "$PROJECT_DIR/conversation"/*.md 2>/dev/null | wc -l),
  "files": $FILES,
  "lines": $LINES,
  "screenshots": $SCREENS,
  "lastUpdated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

log "STATS" "Files: $FILES, Lines: $LINES, Screens: $SCREENS"

# 3. Dashboard rebuild (only if content changed)
log "TASK" "Checking dashboard rebuild"
if [ -f "$PROJECT_DIR/build-dashboard.js" ]; then
    node "$PROJECT_DIR/build-dashboard.js" 2>> "$LOG_FILE"
    if [ $? -eq 0 ]; then
        log "BUILD" "Dashboard rebuilt successfully"
    else
        log "BUILD" "Failed — see log for details"
    fi
else
    log "BUILD" "No builder script found"
fi

# 4. Health check
log "TASK" "Running health check"
ERRORS=0
for img in "$PROJECT_DIR/assets/screenshots"/*.png; do
    [ -f "$img" ] || continue
    if ! file "$img" | grep -q "image"; then
        ERRORS=$((ERRORS + 1))
        log "ERROR" "Invalid image: $(basename "$img")"
    fi
done

if [ $ERRORS -eq 0 ]; then
    log "HEALTH" "All images valid"
else
    log "HEALTH" "$ERRORS errors found"
fi

# 5. Git commit
log "TASK" "Committing changes"
cd "$PROJECT_DIR"
git add -A
if git diff --cached --quiet; then
    log "GIT" "No changes to commit"
else
    git commit -m "Webby: Daily maintenance $(date +%Y-%m-%d)" >> "$LOG_FILE" 2>&1
    log "GIT" "Changes committed"
fi

# Webby's morning summary
log "END" "Maintenance complete"

# Output report (for OpenClaw capture)
echo ""
echo "🕸️  Webby's Morning Report"
echo "=========================="
echo "$(date '+%Y-%m-%d %H:%M EST')"
echo ""
echo "Screenshots: $SCREENS"
echo "Files: $FILES"
echo "Lines: $LINES"
echo "Status: $([ $ERRORS -eq 0 ] && echo '✅ Healthy' || echo '⚠️  Issues found')"
echo ""
echo "Log: $LOG_FILE"

exit 0
