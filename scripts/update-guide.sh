#!/bin/bash
#
# Guide Rebuilder
# Scans docs/ for changes and rebuilds guide pages
# Runs at 7:31 PM EST daily via cron
#

set -e

# Configuration
PROJECT_DIR="$HOME/.openclaw/workspace/projects/al-does-ai"
DOCS_DIR="$PROJECT_DIR/docs"
GUIDE_DIR="$PROJECT_DIR/guide"
LOG_FILE="$PROJECT_DIR/logs/guide.log"
DATE=$(date +%Y-%m-%d)
DATETIME=$(date '+%Y-%m-%d %H:%M:%S %Z')

# Track if changes were made
CHANGES_MADE=false

cd "$PROJECT_DIR"

# Log function
log() {
    echo "[$DATETIME] $1" | tee -a "$LOG_FILE"
}

log "=== Guide Update Started ==="

# Ensure directories exist
mkdir -p "$DOCS_DIR" "$GUIDE_DIR"

# Get list of docs
DOCS=($(ls -1 "$DOCS_DIR"/*.md 2>/dev/null || true))

if [ ${#DOCS[@]} -eq 0 ]; then
    log "No documentation files found in $DOCS_DIR"
    log "Creating sample guide..."
fi

# Generate index.html
INDEX_FILE="$GUIDE_DIR/index.html"
mkdir -p "$GUIDE_DIR"

cat > "$INDEX_FILE" << 'HTML_HEADER'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Al Does AI — Guide</title>
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
            max-width: 900px;
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
        
        .guide-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
        
        .guide-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            transition: transform 0.2s, box-shadow 0.2s;
            text-decoration: none;
            color: inherit;
        }
        
        .guide-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .guide-card h3 {
            font-family: Georgia, serif;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }
        
        .guide-card p {
            color: var(--text-secondary);
            font-size: 0.95rem;
            line-height: 1.6;
        }
        
        .guide-card .meta {
            margin-top: 1rem;
            font-size: 0.8rem;
            color: var(--text-secondary);
        }
        
        .category {
            margin-bottom: 2rem;
        }
        
        .category h2 {
            font-family: Georgia, serif;
            font-size: 1.4rem;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--warm-paper-dark);
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
            text-align: center;
            margin-top: 2rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📚 The Guide</h1>
            <p class="subtitle">Documentation, workflows, and how-to guides for the Al Does AI project</p>
        </header>
        
        <nav class="nav">
            <a href="/">Home</a>
            <a href="/journal/">Journal</a>
            <a href="/guide/">Guide</a>
            <a href="https://github.com/yourusername/al-does-ai">GitHub</a>
        </nav>
        
        <h2 style="margin-bottom: 1.5rem; font-family: Georgia, serif;">Documentation</h2>
        <div class="guide-grid">
HTML_HEADER

# Generate guide cards from docs
for doc in "$DOCS_DIR"/*.md; do
    [ -f "$doc" ] || continue
    
    filename=$(basename "$doc")
    title=$(head -1 "$doc" | sed 's/^#* //')
    # Extract first paragraph after title as description
    desc=$(sed -n '3,10p' "$doc" | grep -v '^#' | grep -v '^$' | head -1 | cut -c1-120)
    date=$(stat -f "%Sm" -t "%Y-%m-%d" "$doc" 2>/dev/null || date +%Y-%m-%d)
    
    echo "            <a href=\"docs/$filename\" class=\"guide-card\">" >> "$INDEX_FILE"
    echo "                <h3>$title</h3>" >> "$INDEX_FILE"
    echo "                <p>${desc}...</p>" >> "$INDEX_FILE"
    echo "                <div class=\"meta\">$date</div>" >> "$INDEX_FILE"
    echo "            </a>" >> "$INDEX_FILE"
    
    log "Added guide card: $title"
done

cat >> "$INDEX_FILE" << HTML_FOOTER
        </div>
        
        <div class="category">
            <h2>Quick Links</h2>
            <div class="guide-grid">
                <a href="https://github.com/yourusername/al-does-ai" class="guide-card">
                    <h3>🐙 GitHub Repository</h3>
                    <p>Source code, issues, and pull requests</p>
                    <div class="meta">External</div>
                </a>
                <a href="/dashboard/" class="guide-card">
                    <h3>📊 Dashboard</h3>
                    <p>Project status and progress tracking</p>
                    <div class="meta">Local</div>
                </a>
            </div>
        </div>
        
        <div class="generated-at">Last updated: $DATETIME</div>
        
        <footer>
            <p>Built with 🔥 by Al • Every prompt published • Every action documented</p>
        </footer>
    </div>
</body>
</html>
HTML_FOOTER

log "Guide index generated at $INDEX_FILE"

# Check if there were changes
if [ -d ".git" ]; then
    CHANGES=$(git status --porcelain 2>/dev/null || true)
    if [ -n "$CHANGES" ]; then
        CHANGES_MADE=true
        git add "$GUIDE_DIR/"
        git commit -m "Guide update: $DATE [auto-generated]"
        log "Git commit successful"
    else
        log "No changes detected in guide"
    fi
else
    log "Warning: Not a git repository"
fi

log "=== Guide Update Complete ==="
echo ""