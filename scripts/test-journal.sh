#!/bin/bash
#
# Test Journal Generation
# Runs JournalWriter immediately (for testing)
#

set -e

PROJECT_DIR="$HOME/.openclaw/workspace/projects/al-does-ai"
DATE=$(date +%Y-%m-%d)
DATETIME=$(date '+%Y-%m-%d %H:%M:%S %Z')

echo "========================================"
echo "   JournalWriter Test Run"
echo "   $DATETIME"
echo "========================================"
echo ""

# Ensure we're in the right directory
cd "$PROJECT_DIR"

echo "📁 Project directory: $PROJECT_DIR"
echo "📄 Target memory file: memory/$DATE.md"
echo "🌐 Journal output: journal/index.html"
echo ""

# Run the journal generation
echo "⏳ Running journal generation..."
"$PROJECT_DIR/scripts/daily-journal.sh"

echo ""
echo "========================================"
echo "   Test Complete"
echo "========================================"

# Show result
if [ -f "$PROJECT_DIR/journal/index.html" ]; then
    echo ""
    echo "✅ Journal generated successfully!"
    echo "   File: journal/index.html"
    echo "   Size: $(wc -c < "$PROJECT_DIR/journal/index.html" | tr -d ' ') bytes"
    echo "   Preview:"
    echo "   $PROJECT_DIR/journal/index.html"
    
    # Open in browser if possible
    if command -v open >/dev/null 2>&1; then
        echo ""
        read -p "🌐 Open in browser? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            open "$PROJECT_DIR/journal/index.html"
        fi
    fi
else
    echo ""
    echo "❌ Journal file not created!"
fi

echo ""
echo "Done!"