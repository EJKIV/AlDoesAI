#!/bin/bash
# update-dashboard.sh - Run this after adding new screenshots

echo "🔄 Updating Al Does AI dashboard..."

# Copy new screenshots from Documents
echo "📸 Checking for new screenshots..."
cp ~/Documents/AlDoesAI/*.png assets/screenshots/ 2>/dev/null || echo "No new screenshots found"

# Update stats (could be automated)
echo "📊 Updating stats..."
echo '{
  "prompts": 3,
  "files": $(find . -type f | wc -l),
  "lines": $(wc -l */*.md | tail -1),
  "lastUpdated": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
}' > stats.json

# Commit changes
echo "💾 Committing to Git..."
git add -A
git commit -m "Auto-update: $(date +%Y-%m-%d-%H:%M)" 2>/dev/null || echo "Nothing to commit"

echo "✅ Dashboard updated!"
echo ""
echo "Refresh your browser to see changes:"
echo "open dashboard/index.html"
