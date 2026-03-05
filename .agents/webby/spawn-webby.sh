#!/bin/bash
# spawn-webby.sh — OpenClaw-compatible spawn wrapper
# This script is called by OpenClaw when spawning Webby

AGENT_DIR="$HOME/.openclaw/workspace/projects/al-does-ai/.agents/webby"

# Webby reports their identity
echo "🕸️  Webby here."
echo ""
echo "Reading my soul..."

if [ -f "$AGENT_DIR/SOUL.md" ]; then
    SOUL=$(grep "^_.*_$" "$AGENT_DIR/SOUL.md" | head -1 | tr -d '_')
    echo "  → $SOUL"
fi

echo ""
echo "Beginning daily maintenance..."
echo ""

# Execute Webby's daily run
exec "$AGENT_DIR/webby-run.sh"
