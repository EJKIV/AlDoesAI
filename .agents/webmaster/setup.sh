#!/bin/bash
# setup-webmaster.sh — Install webmaster agent and cron job

PROJECT_DIR="$HOME/.openclaw/workspace/projects/al-does-ai"
WEBMASTER_DIR="$PROJECT_DIR/.agents/webmaster"

echo "🔧 Webmaster Agent Setup"
echo "========================"
echo ""

# Make scripts executable
echo "📋 Making scripts executable..."
chmod +x "$WEBMASTER_DIR/webmaster-daily.sh"
chmod +x "$PROJECT_DIR/showmeal"
chmod +x "$PROJECT_DIR/update-dashboard.sh"
echo "   ✅ Done"

# Create log directory
mkdir -p "$WEBMASTER_DIR/logs"

# Install cron job (optional)
echo ""
echo "⏰ Cron Installation (optional)"
echo "--------------------------------"
echo "To run webmaster daily at 6 AM, run:"
echo ""
echo "  crontab -e"
echo ""
echo "Add this line:"
echo "  0 6 * * * $WEBMASTER_DIR/webmaster-daily.sh >> $WEBMASTER_DIR/logs/cron.log 2>&1"
echo ""
read -p "Install cron job now? (y/n): " REPLY
echo ""

if [ "$REPLY" = "y" ]; then
    # Check if already exists
    if crontab -l 2>/dev/null | grep -q "webmaster-daily"; then
        echo "   Cron job already exists"
    else
        (crontab -l 2>/dev/null; echo "0 6 * * * $WEBMASTER_DIR/webmaster-daily.sh >> $WEBMASTER_DIR/logs/cron.log 2>&1") | crontab -
        echo "   ✅ Cron job installed"
    fi
else
    echo "   Skipped. Install manually when ready."
fi

# Test run
echo ""
echo "🧪 Test Run"
echo "-----------"
read -p "Run webmaster agent now? (y/n): " REPLY
echo ""

if [ "$REPLY" = "y" ]; then
    "$WEBMASTER_DIR/webmaster-daily.sh"
else
    echo "   Skipped. Run manually with:"
    echo "   $WEBMASTER_DIR/webmaster-daily.sh"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Commands:"
echo "  ./.agents/webmaster/webmaster-daily.sh  # Run manually"
echo "  ./showmeal                                # View dashboard"
echo "  crontab -l                                # View cron jobs"
echo ""
echo "Logs: $WEBMASTER_DIR/logs/"
