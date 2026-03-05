#!/bin/bash
# update-dashboard.sh - Update stats, sync screenshots, commit changes

PROJECT_DIR="$HOME/.openclaw/workspace/projects/al-does-ai"
cd "$PROJECT_DIR" || exit 1

echo "🤖 Al Does AI Dashboard Updater"
echo "================================"
echo ""

# Update Stats
echo "📊 Counting files and lines..."
FILE_COUNT=$(find . -type f \( -name "*.md" -o -name "*.html" -o -name "*.txt" -o -name "*.sh" \) ! -path "./.git/*" | wc -l | tr -d ' ')
LINE_COUNT=$(find . -type f \( -name "*.md" -o -name "*.html" -o -name "*.txt" \) ! -path "./.git/*" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
SCREENSHOT_COUNT=$(ls assets/screenshots/*.png 2>/dev/null | wc -l | tr -d ' ')

cat > stats.json << EOF
{
  "prompts": 3,
  "files": $FILE_COUNT,
  "lines": $LINE_COUNT,
  "screenshots": $SCREENSHOT_COUNT,
  "lastUpdated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "   Files: $FILE_COUNT"
echo "   Lines: $LINE_COUNT"
echo "   Screenshots: $SCREENSHOT_COUNT"

# Git commit if changes exist
echo ""
echo "💾 Checking for changes..."
git add -A
if git diff --cached --quiet; then
    echo "   No changes to commit"
else
    git commit -m "Auto-update: $(date +%Y-%m-%d-%H:%M)"
    echo "   ✅ Changes committed"
fi

echo ""
echo "✅ Dashboard updated successfully!"
