#!/bin/bash
# build-dashboard-v4.sh — Complete dashboard rebuild with pre-rendered content

PROJECT_DIR="$HOME/.openclaw/workspace/projects/al-does-ai"
cd "$PROJECT_DIR"

echo "🕸️  Webby: Building Dashboard V4"
echo "================================="
echo ""

# Step 1: Create docs-rendered folder
echo "📄 Step 1: Creating docs-rendered folder..."
mkdir -p docs-rendered
mkdir -p .built

# Step 2: Convert all .md files to HTML
echo "📄 Step 2: Converting markdown files..."

for file in docs/*.md content/*.md *.md; do
    [ -f "$file" ] || continue
    basename=$(basename "$file" .md)
    
    if command -v npx marked &> /dev/null; then
        npx marked "$file" > "docs-rendered/${basename}.html" 2>/dev/null
    else
        # Fallback: simple markdown conversion
        sed 's/^# /\u003ch1>/g; s/^## /\u003ch2>/g; s/^### /\u003ch3>/g; s/\*\*\([^*]*\)\*\*/\u003cstrong>\1\u003c\/strong>/g; s/\*\([^*]*\)\*/\u003cem>\1\u003c\/em>/g' "$file" > "docs-rendered/${basename}.html"
    fi
    echo "   ✅ ${basename}.html"
done

# Step 3: Extract 180-day plan
extract_plan() {
    echo "   Extracting 180-day plan..."
    cat docs/PROJECT_CHARTER.md | grep -A 200 "^## The Arc" | head -60 > .built/plan_section.md
}

# Step 4: Build full conversation with inline images
build_conversation() {
    echo "💬 Step 4: Building conversation thread..."
    
    # Start with header
    cat > .built/conversation_content.html << 'EOF'
<div class="conversation-container">
EOF

    # Add full conversation log with embedded content
    if command -v npx marked &> /dev/null; then
        npx marked content/FULL_CONVERSATION_LOG.md >> .built/conversation_content.html 2>/dev/null
    else
        # Simple fallback
        cat content/FULL_CONVERSATION_LOG.md >> .built/conversation_content.html
    fi

    # Add inline images after relevant exchanges
    cat >> .built/conversation_content.html << 'EOF'

<h3>📸 Visual Timeline</h3>
<div class="screenshot-grid" style="margin-top: 1rem;">
EOF

    # Add screenshots inline
    for img in assets/screenshots/*.png; do
        [ -f "$img" ] || continue
        filename=$(basename "$img")
        encoded=$(printf '%s' "$filename" | sed 's/ /%20/g')
        
        cat >> .built/conversation_content.html << EOF
  <div class="screenshot-item">
    <img src="assets/screenshots/${encoded}" alt="${filename}" loading="lazy" style="width: 100%;">
    <div class="screenshot-meta">${filename}</div>
  </div>
EOF
    done

    cat >> .built/conversation_content.html << 'EOF'
</div>
</div>
EOF

    echo "   ✅ Conversation thread built"
}

# Step 5: Generate budget tracker HTML
generate_budget_html() {
    echo "💰 Step 5: Generating budget tracker..."
    
    cat > .built/budget_content.html <> 'EOF'
<div class="budget-container">
  <div class="card">
    <div class="card-title">💰 Running P&L</div>
    <tr class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Invested</div>
        <div class="stat-value" style="color: var(--accent);">$0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Revenue</div>
        <div class="stat-value" style="color: var(--success);">$0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Net</div>
        <div class="stat-value">$0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Days to Break Even</div>
        <div class="stat-value">—</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">📊 Investment Timeline</div>
    <div class="timeline-container">
      <div class="timeline-bar">
        <div class="timeline-fill" style="width: 0%;"></div>
      </div>
      <div class="timeline-labels">
        <span>Day 0</span>
        <span style="color: var(--accent);">Day 30: First $1</span>
        <span>Day 90</span>
        <span style="color: var(--success);">Day 180: $1K/mo</span>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">💸 Investments</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Item</th>
          <th>Category</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2026-03-05</td>
          <td>Project setup + docs</td>
          <td>Labor</td>
          <td>$0</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <div class="card-title">📈 Projections</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Milestone</th>
          <th>Target Date</th>
          <th>Revenue</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>First $1</td>
          <td>Day 30</td>
          <td>$1</td>
          <td>—</td>
        </tr>
        <tr>
          <td>First $100</td>
          <td>Day 60</td>
          <td>$100</td>
          <td>—</td>
        </tr>
        <tr>
          <td>Break Even</td>
          <td>Day 90</td>
          <td>$0</td>
          <td>—</td>
        </tr>
        <tr>
          <td>First $1,000 month</td>
          <td>Day 180</td>
          <td>$1,000/mo</td>
          <td>🎯 Target</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <div class="card-title">🎯 Break-Even Calculator</div>
    <div style="background: var(--bg-elevated); padding: 1.5rem; border-radius: 8px;">
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-label">Current Investment</div>
          <div class="stat-value" style="color: var(--accent);">$0</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Break-Even Target</div>
          <div class="stat-value">Day 90</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Required Daily Revenue</div>
          <div class="stat-value">TBD</div>
        </div>
      </div>
    </div>
  </div>
</div>
EOF
}