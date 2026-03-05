#!/bin/bash
# webmaster-daily.sh — Daily dashboard maintenance
# Run: ./webmaster-daily.sh
# Cron: 0 6 * * * /path/to/webmaster-daily.sh

PROJECT_DIR="$HOME/.openclaw/workspace/projects/al-does-ai"
SCREENSHOTS_SOURCE="$HOME/Documents/AlDoesAI/screenshots"
LOG_FILE="$PROJECT_DIR/.agents/webmaster/log-$(date +%Y-%m-%d).txt"

log() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

cd "$PROJECT_DIR" || exit 1

log "🤖 Webmaster Agent — Daily Run"
log "================================"
log ""

# 1. Sync Screenshots
log "📸 Checking for new screenshots..."
if [ -d "$SCREENSHOTS_SOURCE" ]; then
    NEW_COUNT=$(find "$SCREENSHOTS_SOURCE" -type f \( -name "*.png" -o -name "*.jpg" \) 2>/dev/null | wc -l)
    CURRENT_COUNT=$(find assets/screenshots -type f \( -name "*.png" -o -name "*.jpg" \) 2>/dev/null | wc -l)
    
    if [ "$NEW_COUNT" -gt "$CURRENT_COUNT" ]; then
        log "   Found $NEW_COUNT screenshots (have $CURRENT_COUNT)"
        cp "$SCREENSHOTS_SOURCE"/*.{png,jpg} assets/screenshots/ 2>/dev/null
        log "   ✅ Synced $((NEW_COUNT - CURRENT_COUNT)) new screenshots"
    else
        log "   Screenshots up to date"
    fi
else
    log "   ⚠️ Source folder not found"
fi

# 2. Update Stats
log ""
log "📊 Updating stats..."
FILE_COUNT=$(find . -type f ! -path "./.git/*" | wc -l)
LINE_COUNT=$(find . -type f \( -name "*.md" -o -name "*.html" \) ! -path "./.git/*" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
SCREENSHOT_COUNT=$(ls assets/screenshots/*.{png,jpg} 2>/dev/null | wc -l)

cat > stats.json << EOF
{
  "prompts": $(ls conversation/*.md 2>/dev/null | wc -l),
  "files": $FILE_COUNT,
  "lines": $LINE_COUNT,
  "screenshots": $SCREENSHOT_COUNT,
  "lastUpdated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
log "   Files: $FILE_COUNT, Lines: $LINE_COUNT, Screenshots: $SCREENSHOT_COUNT"

# 3. Rebuild Dashboard HTML (if content changed)
log ""
log "🔄 Checking if dashboard rebuild needed..."
LAST_BUILD=$(stat -f "%m" dashboard/index.html 2>/dev/null || echo "0")
LATEST_CONTENT=$(find content docs -name "*.md" -exec stat -f "%m" {} \; 2>/dev/null | sort -nr | head -1)

if [ "$LATEST_CONTENT" -gt "$LAST_BUILD" ]; then
    log "   Content changed, rebuild required"
    log "   ⚠️ NOTIFY: Dashboard needs manual rebuild (templates need regeneration)"
    # TODO: Auto-rebuild with node.js script
else
    log "   Dashboard current"
fi

# 4. Health Check
log ""
log "🏥 Running health check..."
BROKEN_IMAGES=0
for img in assets/screenshots/*.{png,jpg}; do
    [ -f "$img" ] || continue
    # Check if file is valid image
    if ! file "$img" | grep -q "image"; then
        log "   ⚠️ Invalid image: $img"
        BROKEN_IMAGES=$((BROKEN_IMAGES + 1))
    fi
done

if [ "$BROKEN_IMAGES" -eq 0 ]; then
    log "   ✅ All images healthy"
else
    log "   ⚠️ Found $BROKEN_IMAGES broken images"
fi

# 5. Git Commit
log ""
log "💾 Committing changes..."
git add -A
if git diff --cached --quiet; then
    log "   Nothing to commit"
else
    git commit -m "Webmaster: Daily update $(date +%Y-%m-%d)"
    log "   ✅ Committed changes"
fi

# 6. Report
log ""
log "📊 Daily Report"
log "---------------"
log "Status: ✅ HEALTHY"
log "Files: $FILE_COUNT"
log "Lines: $LINE_COUNT"
log "Screenshots: $SCREENSHOT_COUNT"
log "Log: $LOG_FILE"
log ""
log "Next run: $(date -v+1d +%Y-%m-%d) 06:00 EST"

# Send notification (when Telegram configured)
# echo "Webmaster update complete: $FILE_COUNT files, $SCREENSHOT_COUNT screenshots" | telegram-notify

exit 0
