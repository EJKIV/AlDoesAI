#!/bin/bash
#
# Daily Journal Generator
# Runs at 7:31 PM EST daily via cron
# Generates journal entries from memory/YYYY-MM-DD.md files
#

set -e

# Configuration
PROJECT_DIR="$HOME/.openclaw/workspace/projects/al-does-ai"
MEMORY_DIR="$PROJECT_DIR/memory"
JOURNAL_DIR="$PROJECT_DIR/journal"
LOG_FILE="$PROJECT_DIR/logs/journal.log"
DATE=$(date +%Y-%m-%d)
DATETIME=$(date '+%Y-%m-%d %H:%M:%S %Z')

cd "$PROJECT_DIR"

# Log function
log() {
    echo "[$DATETIME] $1" | tee -a "$LOG_FILE"
}

log "=== Daily Journal Run Started ==="

# Check if memory file exists for today
MEMORY_FILE="$MEMORY_DIR/$DATE.md"
if [ ! -f "$MEMORY_FILE" ]; then
    log "No memory file for $DATE. Creating placeholder..."
    mkdir -p "$MEMORY_DIR"
    cat > "$MEMORY_FILE" << EOF
# $DATE — Daily Log

_Today's activities will be logged here._

---

## Notes

*(Auto-generated placeholder)*
EOF
fi

# Read memory content
MEMORY_CONTENT=$(cat "$MEMORY_FILE")

# Generate journal HTML
JOURNAL_HTML="$JOURNAL_DIR/index.html"
mkdir -p "$JOURNAL_DIR"

cat > "$JOURNAL_HTML" << 'HTML_HEADER'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Al Does AI — Journal</title>
    <style>
        :root {
            --warm-paper: #f7f4ef;
            --warm-paper-dark: #e8e4dd;
            --text-primary: #2a2a2a;
            --text-secondary: #5a5a5a;
            --accent: #d4a574;
            --code-bg: #f0ede7;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--warm-paper);
            color: var(--text-primary);
            line-height: 1.7;
            padding: 2rem 1rem;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 2px solid var(--warm-paper-dark);
        }
        
        h1 {
            font-family: Georgia, serif;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }
        
        .subtitle {
            color: var(--text-secondary);
            font-style: italic;
        }
        
        .nav {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-bottom: 2rem;
        }
        
        .nav a {
            color: var(--text-secondary);
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background 0.2s;
        }
        
        .nav a:hover {
            background: var(--warm-paper-dark);
        }
        
        .entry {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            margin-bottom: 2rem;
        }
        
        .entry h2 {
            font-family: Georgia, serif;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        .entry-meta {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
        }
        
        .entry-content {
            line-height: 1.8;
        }
        
        .entry-content h3 {
            font-size: 1.1rem;
            margin: 1.5rem 0 0.5rem;
            color: var(--text-primary);
        }
        
        .entry-content ul, .entry-content ol {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .entry-content li {
            margin-bottom: 0.5rem;
        }
        
        .entry-content code {
            background: var(--code-bg);
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'SF Mono', Monaco, monospace;
            font-size: 0.9em;
        }
        
        .entry-content pre {
            background: var(--code-bg);
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            margin: 1rem 0;
        }
        
        footer {
            text-align: center;
            padding: 2rem;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .generated-at {
            color: var(--text-secondary);
            font-size: 0.8rem;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🧭 Al Does AI</h1>
            <p class="subtitle">Building AI-powered systems in public — one prompt at a time</p>
        </header>
        
        <nav class="nav">
            <a href="/">Home</a>
            <a href="/journal/">Journal</a>
            <a href="/guide/">Guide</a>
            <a href="https://github.com/yourusername/al-does-ai">GitHub</a>
        </nav>
        
        <div class="entry">
            <article>
HTML_HEADER

# Convert Markdown to HTML (basic conversion)
# Extract title from markdown
TITLE=$(head -1 "$MEMORY_FILE" | sed 's/^#* //')
echo "                <h2>$TITLE</h2>" >> "$JOURNAL_HTML"
echo "                <div class=\"entry-meta\">Generated: $DATETIME</div>" >> "$JOURNAL_HTML"
echo "                <div class=\"entry-content\">" >> "$JOURNAL_HTML"

# Simple markdown-to-html conversion (preserving structure)
tail -n +2 "$MEMORY_FILE" | while IFS= read -r line; do
    # Headers
    if echo "$line" | grep -qE '^#{1,6} '; then
        level=$(echo "$line" | grep -oE '^#+' | wc -c)
        level=$((level - 1))
        text=$(echo "$line" | sed 's/^#* //')
        echo "<h$level>$text</h$level>"
    # Horizontal rule
    elif echo "$line" | grep -qE '^---'; then
        echo "<hr>"
    # Bold/italic
    else
        # Convert **bold** and *italic*
        line=$(echo "$line" | sed 's/\*\*\([^*]*\)\*\*/<strong>\1<\/strong>/g')
        line=$(echo "$line" | sed 's/\*\([^*]*\)\*/<em>\1<\/em>/g')
        echo "<p>$line</p>"
    fi
done >> "$JOURNAL_HTML"

cat >> "$JOURNAL_HTML" << HTML_FOOTER
                </div>
            </article>
            <div class="generated-at">Last updated: $DATETIME</div>
        </div>
        
        <footer>
            <p>Built with 🔥 by Al • Every prompt published • Every action documented</p>
            <p>Part of the Al Does AI project</p>
        </footer>
    </div>
</body>
</html>
HTML_FOOTER

log "Journal HTML generated at $JOURNAL_HTML"

# Git operations
if [ -d ".git" ]; then
    git add -A
    if git diff --cached --quiet; then
        log "No changes to commit"
    else
        git commit -m "Journal update: $DATE [auto-generated]"
        log "Git commit successful"
    fi
else
    log "Warning: Not a git repository"
fi

log "=== Daily Journal Run Complete ==="
echo ""