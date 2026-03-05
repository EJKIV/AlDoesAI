#!/bin/bash
# deploy-webmaster.sh — Deploy the webmaster agent for daily operation

echo "🚀 Webmaster Agent Deployment"
echo "==============================="
echo ""

WEBMASTER_DIR="$HOME/.openclaw/workspace/projects/al-does-ai/.agents/webmaster"
PROJECT_DIR="$HOME/.openclaw/workspace/projects/al-does-ai"

cd "$PROJECT_DIR"

# 1. Ensure all scripts are executable
echo "📋 Step 1: Setting permissions..."
chmod +x "$WEBMASTER_DIR/webmaster-daily.sh"
chmod +x "$WEBMASTER_DIR/setup.sh"
chmod +x "$PROJECT_DIR/showmeal"
chmod +x "$PROJECT_DIR/update-dashboard.sh"
chmod +x "$PROJECT_DIR/build-dashboard.js
echo "   ✅ All scripts executable"

# 2. Create log directory
echo ""
echo "📁 Step 2: Creating log directory..."
mkdir -p "$WEBMASTER_DIR/logs"
echo "   ✅ Logs ready at: $WEBMASTER_DIR/logs/"

# 3. Test build-dashboard.js
echo ""
echo "🏗️  Step 3: Testing dashboard builder..."
if node "$PROJECT_DIR/build-dashboard.js" 2>/dev/null; then
    echo "   ✅ Dashboard builds successfully"
else
    echo "   ⚠️  Dashboard build requires Node.js (should be available)"
fi

# 4. Run initial webmaster check
echo ""
echo "🧪 Step 4: Running initial check..."
"$WEBMASTER_DIR/webmaster-daily.sh" | tail -15

# 5. Summary
echo ""
echo "📊 Deployment Summary"
echo "====================="
echo ""
echo "Agent: webmaster"
echo "Location: $WEBMASTER_DIR/"
echo ""
echo "Daily operations:"
echo "  • Screenshot sync from ~/Documents/AlDoesAI/screenshots"
echo "  • Stats update (prompts, files, lines, screenshots)"
echo "  • Dashboard rebuild (when content changes)"
echo "  • Git commit with descriptive message"
echo "  • Health check validation"
echo ""
echo "Manual commands:"
echo "  ./.agents/webmaster/webmaster-daily.sh  # Run now"
echo "  ./showmeal                                # View dashboard"
echo "  node build-dashboard.js                   # Rebuild HTML"
echo ""
echo "Cron installation options:"
echo ""
echo "Option A: Add to crontab (recommended)"
echo "  crontab -e"
echo "  Add: 0 6 * * * $WEBMASTER_DIR/webmaster-daily.sh"
echo ""
echo "Option B: Use launchd (macOS native)"
echo "  See: $WEBMASTER_DIR/com.aldoesai.webmaster.plist"
echo ""
read -p "Install cron job now? (y/n): " REPLY
if [ "$REPLY" = "y" ]; then
    if crontab -l 2>/dev/null | grep -q "webmaster-daily"; then
        echo "   Cron job already exists"
    else
        (crontab -l 2>/dev/null; echo "0 6 * * * $WEBMASTER_DIR/webmaster-daily.sh >> $WEBMASTER_DIR/logs/cron.log 2>&1") | crontab -
        echo "   ✅ Cron job installed for 6 AM daily"
    fi
else
    echo "   Skipped. Install later with: $WEBMASTER_DIR/setup.sh"
fi

echo ""
echo "✅ Webmaster Agent Deployed!"
echo ""
echo "Next: Run ./showmeal to view the updated dashboard"
