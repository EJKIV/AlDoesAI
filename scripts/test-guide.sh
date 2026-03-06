#!/bin/bash
#
# Test Guide Rebuild
# Runs GuideBuilder immediately (for testing)
#

set -e

PROJECT_DIR="$HOME/.openclaw/workspace/projects/al-does-ai"
DATE=$(date +%Y-%m-%d)
DATETIME=$(date '+%Y-%m-%d %H:%M:%S %Z')

echo "========================================"
echo "   GuideBuilder Test Run"
echo "   $DATETIME"
echo "========================================"
echo ""

# Ensure we're in the right directory
cd "$PROJECT_DIR"

echo "📁 Project directory: $PROJECT_DIR"
echo "📚 Docs source: docs/"
echo "🌐 Guide output: guide/index.html"
echo ""

# Show docs found
echo "📂 Documentation files found:"
DOC_COUNT=$(find "$PROJECT_DIR/docs" -name "*.md" -type f 2>/dev/null | wc -l)
echo "   Total: $DOC_COUNT markdown files"
find "$PROJECT_DIR/docs" -name "*.md" -type f -exec basename {} \; | sed 's/^/   - /' 2>/dev/null || echo "   (none)"
echo ""

# Run the guide generation
echo "⏳ Running guide generation..."
"$PROJECT_DIR/scripts/update-guide.sh"

echo ""
echo "========================================"
echo "   Test Complete"
echo "========================================"

# Show result
if [ -f "$PROJECT_DIR/guide/index.html" ]; then
    echo ""
    echo "✅ Guide generated successfully!"
    echo "   File: guide/index.html"
    echo "   Size: $(wc -c < "$PROJECT_DIR/guide/index.html" | tr -d ' ') bytes"
    echo ""
    
    # Open in browser if possible
    if command -v open >/dev/null 2>&1; then
        read -p "🌐 Open in browser? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            open "$PROJECT_DIR/guide/index.html"
        fi
    fi
else
    echo ""
    echo "❌ Guide file not created!"
fi

echo ""
echo "Done!"