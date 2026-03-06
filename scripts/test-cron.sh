#!/bin/bash
#
# Test Cron Environment
# Simulates the cron environment for testing
#

set -e

PROJECT_DIR="$HOME/.openclaw/workspace/projects/al-does-ai"
DATE=$(date +%Y-%m-%d)
DATETIME=$(date '+%Y-%m-%d %H:%M:%S %Z')

echo "========================================"
echo "   Cron Environment Simulation"
echo "   $DATETIME"
echo "========================================"
echo ""

# Clear environment to simulate cron
if [ "${SIMULATE_CRON:-1}" = "1" ]; then
    echo "🔧 Simulating cron environment..."
    echo "   Clearing TERM, DISPLAY, and other interactive vars"
    
    # Save original values
    OLD_TERM="${TERM:-}"
    OLD_DISPLAY="${DISPLAY:-}"
    OLD_LANG="${LANG:-}"
    OLD_PATH="${PATH:-}"
    
    # Clear interactive environment variables
    unset TERM
    unset DISPLAY
    unset LANG
    unset LC_ALL
    unset LC_COLLATE
    unset LC_CTYPE
    unset LC_MESSAGES
    unset LC_MONETARY
    unset LC_NUMERIC
    unset LC_TIME
    
    # Set minimal PATH like cron
    export PATH="/usr/bin:/bin:/usr/local/bin"
    
    echo ""
    echo "🌍 Simulated Environment:"
    echo "   Current directory: $(pwd)"
    echo "   Home: $HOME"
    echo "   PATH: $PATH"
    echo "   TERM: ${TERM:-(none)} (as expected in cron)"
    echo ""
fi

# Change to project directory
cd "$PROJECT_DIR"

echo "📁 Project: $PROJECT_DIR"
echo ""

# Create log directory if needed
mkdir -p "$PROJECT_DIR/logs"

echo "========================================"
echo "   Running openclaw-cron.sh"
echo "========================================"
echo ""

# Run the actual cron script
exec "$PROJECT_DIR/scripts/openclaw-cron.sh" 2>&1

echo ""
echo "========================================"
echo "   Simulation Complete"
echo "========================================"
echo ""

# Check logs
echo "📊 Log Files:"
echo ""
if [ -f "$PROJECT_DIR/logs/cron.log" ]; then
    echo "   === cron.log (last 20 lines) ==="
    tail -n 20 "$PROJECT_DIR/logs/cron.log"
    echo ""
fi

if [ -f "$PROJECT_DIR/logs/journal.log" ]; then
    echo "   === journal.log (last 10 lines) ==="
    tail -n 10 "$PROJECT_DIR/logs/journal.log"
    echo ""
fi

if [ -f "$PROJECT_DIR/logs/guide.log" ]; then
    echo "   === guide.log (last 10 lines) ==="
    tail -n 10 "$PROJECT_DIR/logs/guide.log"
    echo ""
fi

echo ""
echo "✅ Cron simulation complete!"
echo ""

# Restore environment if we modified it
if [ "${SIMULATE_CRON:-1}" = "1" ]; then
    echo "🔄 Restoring original environment..."
    [ -n "$OLD_TERM" ] && export TERM="$OLD_TERM"
    [ -n "$OLD_DISPLAY" ] && export DISPLAY="$OLD_DISPLAY"
    [ -n "$OLD_LANG" ] && export LANG="$OLD_LANG"
    [ -n "$OLD_PATH" ] && export PATH="$OLD_PATH"
fi

echo "Done!"