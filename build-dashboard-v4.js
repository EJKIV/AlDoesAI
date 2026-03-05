#!/usr/bin/env node
/**
 * build-dashboard-v4.js — Complete rebuild with pre-rendered content
 * Output: dashboard/index.html
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const PROJECT_DIR = process.env.HOME + '/.openclaw/workspace/projects/al-does-ai';
const OUTPUT_FILE = path.join(PROJECT_DIR, 'dashboard', 'index.html');

console.log('🕸️  Webby: Building Dashboard V4');
console.log('=================================');
console.log('');

// Step 1: Convert all markdown docs
function convertDocs() {
  const docsDir = path.join(PROJECT_DIR, 'docs');
  const contentDir = path.join(PROJECT_DIR, 'content');
  const baseDir = PROJECT_DIR;
  
  const docs = {};
  
  function convertFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return marked.parse(content);
    } catch (e) {
      return '<p>Cannot load: ' + path.basename(filePath) + '</p>';
    }
  }
  
  // Docs folder
  if (fs.existsSync(docsDir)) {
    fs.readdirSync(docsDir).forEach(f => {
      if (f.endsWith('.md')) {
        docs[f] = convertFile(path.join(docsDir, f));
      }
    });
  }
  
  // Content folder
  if (fs.existsSync(contentDir)) {
    fs.readdirSync(contentDir).forEach(f => {
      if (f.endsWith('.md')) {
        docs['content/' + f] = convertFile(path.join(contentDir, f));
      }
    });
  }
  
  // Root level
  fs.readdirSync(baseDir).forEach(f => {
    if (f.endsWith('.md') && !f.startsWith('.')) {
      docs[f] = convertFile(path.join(baseDir, f));
    }
  });
  
  return docs;
}

// Step 2: Get screenshots
function getScreenshots() {
  const screenshotsDir = path.join(PROJECT_DIR, 'assets', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) return [];
  return fs.readdirSync(screenshotsDir)
    .filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
    .map(f => ({ file: f, encoded: encodeURIComponent(f) }));
}

// Step 3: Get conversation log
function getConversation() {
  const logFile = path.join(PROJECT_DIR, 'content', 'FULL_CONVERSATION_LOG.md');
  if (!fs.existsSync(logFile)) return '<p>No conversation log found</p>';
  return marked.parse(fs.readFileSync(logFile, 'utf8'));
}

// Step 4: Get 180-day plan
function getPlan() {
  const charter = path.join(PROJECT_DIR, 'docs', 'PROJECT_CHARTER.md');
  if (!fs.existsSync(charter)) return '<p>No plan found</p>';
  
  const charterContent = fs.readFileSync(charter, 'utf8');
  // Extract just the arc section for display
  const arcMatch = charterContent.match(/^## The Arc[\s\S]*?(?=^## |\Z)/m);
  if (arcMatch) {
    return marked.parse(arcMatch[0]);
  }
  return marked.parse(charterContent);
}

// Convert docs
console.log('📄 Converting documents...');
const docs = convertDocs();
console.log('   Converted ' + Object.keys(docs).length + ' documents');

// Get screenshots
console.log('📸 Loading screenshots...');
const screenshots = getScreenshots();
console.log('   Found ' + screenshots.length + ' screenshots');

// Get conversation
console.log('💬 Loading conversation log...');
const conversation = getConversation();

// Get plan
console.log('📅 Extracting 180-day plan...');
const plan = getPlan();

console.log('');
console.log('Building HTML...');

// Build HTML parts
const screenshotHTML = screenshots.map(s => `
          <div class="screenshot-item">
            <img src="assets/screenshots/${s.encoded}" alt="${s.file}" loading="lazy"
                 onerror="this.parentElement.style.display='none'">
            <div class="screenshot-meta">${s.file.replace(/\.png$/, '')}</div>
          </div>`).join('');

const docNavHTML = Object.keys(docs).map((f, i) => 
  `<div class="doc-tab ${i === 0 ? 'active' : ''}" onclick="showDoc('${f.replace(/[^a-zA-Z0-9]/g, '-')}')">${f}</div>`
).join('');

const docContentHTML = Object.entries(docs).map(([f, content], i) => {
  const docId = f.replace(/[^a-zA-Z0-9]/g, '-');
  return `<div class="doc-content content-display ${i === 0 ? 'active' : ''}" id="doc-${docId}">${content}</div>`;
}).join('');

// Full HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Al Does AI — Dashboard V4</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --primary: #8B5CF6; --secondary: #06B6D4; --accent: #F59E0B;
      --success: #10B981; --danger: #EF4444; --bg: #0F0F0F;
      --bg-elevated: #1A1A1A; --bg-card: #252525; --text: #F9FAFB;
      --text-muted: #9CA3AF; --border: #374151;
    }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
           background: var(--bg); color: var(--text); line-height: 1.6; }
    .header { padding: 2rem; background: linear-gradient(135deg, var(--primary), var(--secondary)); }
    .header-content { max-width: 1400px; margin: 0 auto; }
    .stats-bar { display: flex; gap: 3rem; margin-top: 1.5rem; flex-wrap: wrap; }
    .stat { display: flex; flex-direction: column; }
    .stat-value { font-size: 2rem; font-weight: 700; }
    .stat-label { font-size: 0.85rem; text-transform: uppercase; opacity: 0.8; }
    .nav { background: var(--bg-elevated); border-bottom: 1px solid var(--border);
           padding: 0 2rem; position: sticky; top: 0; z-index: 99; }
    .nav-content { max-width: 1400px; margin: 0 auto; display: flex; gap: 2rem; flex-wrap: wrap; }
    .nav-item { padding: 1rem 0; border-bottom: 2px solid transparent; cursor: pointer;
                opacity: 0.6; transition: all 0.2s; white-space: nowrap; }
    .nav-item:hover, .nav-item.active { opacity: 1; border-bottom-color: var(--secondary); }
    .main { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .card { background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border);
            padding: 1.5rem; margin-bottom: 1.5rem; }
    .card-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; color: var(--secondary); }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    
    /* Tasks */
    .task-item { display: flex; gap: 1rem; padding: 1rem; background: var(--bg-elevated);
                 border-radius: 8px; margin-bottom: 0.75rem; border-left: 4px solid var(--accent); }
    .task-item.completed { border-color: var(--success); opacity: 0.6; }
    .task-checkbox { width: 24px; height: 24px; border: 2px solid var(--accent); border-radius: 4px;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0; }
    .task-checkbox.checked { background: var(--success); border-color: var(--success); }
    .task-checkbox.checked::after { content: '✓'; color: white; font-weight: bold; }
    
    /* Screenshots */
    .screenshot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem; }
    .screenshot-item { background: var(--bg-elevated); border-radius: 8px; overflow: hidden;
                       border: 1px solid var(--border); }
    .screenshot-item img { width: 100%; display: block; }
    .screenshot-meta { padding: 0.75rem; font-size: 0.85rem; color: var(--text-muted);
                       text-align: center; background: var(--bg); }
    
    /* Budget */
    .stats-row { display: flex; gap: 1.5rem; flex-wrap: wrap; }
    .stat-card { background: var(--bg); padding: 1.5rem; border-radius: 8px; flex: 1; min-width: 200px;
                border: 1px solid var(--border); }
    .stat-card .stat-value { font-size: 1.5rem; color: var(--text); margin-top: 0.5rem; }
    .stat-card .stat-label { font-size: 0.85rem; color: var(--text-muted); }
    .data-table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.9rem; }
    .data-table th, .data-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--border); }
    .data-table th { background: var(--bg); font-weight: 500; }
    .timeline-container { margin-top: 1.5rem; }
    .timeline-bar { height: 12px; background: var(--bg); border-radius: 6px; overflow: hidden; }
    .timeline-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); width: 0%; }
    .timeline-labels { display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted); }
    
    /* Content display */
    .content-display { max-height: 800px; overflow-y: auto; padding-right: 1rem; }
    .content-display h1 { color: var(--secondary); margin-bottom: 1rem; font-size: 1.8rem; }
    .content-display h2 { color: var(--primary); margin: 1.5rem 0 0.75rem; font-size: 1.4rem; }
    .content-display h3 { color: var(--accent); margin: 1rem 0 0.5rem; font-size: 1.1rem; }
    .content-display p { margin-bottom: 1rem; line-height: 1.7; }
    .content-display ul, .content-display ol { margin: 1rem 0 1rem 2rem; }
    .content-display li { margin-bottom: 0.5rem; }
    .content-display code { background: var(--bg-elevated); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.9em; font-family: monospace; }
    .content-display pre { background: var(--bg); padding: 1rem; border-radius: 6px;
                           overflow-x: auto; margin: 1rem 0; border: 1px solid var(--border); }
    .content-display pre code { background: transparent; padding: 0; }
    .content-display table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    .content-display th, .content-display td { padding: 0.75rem; text-align: left;
                                              border-bottom: 1px solid var(--border); }
    .content-display th { background: var(--bg-elevated); font-weight: 500; }
    .content-display tr:hover { background: var(--bg-elevated); }
    .content-display strong { color: var(--text); }
    .content-display a { color: var(--secondary); text-decoration: none; }
    .content-display a:hover { text-decoration: underline; }
    
    /* Progress bar */
    .progress-container { margin-top: 2rem; }
    .progress-text { font-size: 1rem; margin-bottom: 0.5rem; }
    .progress-bar { height: 12px; background: var(--bg); border-radius: 6px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); transition: width 0.3s; }
    
    /* Document tabs */
    .doc-nav { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .doc-tab { padding: 0.5rem 1rem; background: var(--bg-elevated); border-radius: 6px;
               cursor: pointer; font-size: 0.85rem; transition: all 0.2s; border: 1px solid transparent; }
    .doc-tab:hover { background: rgba(255,255,255,0.1); }
    .doc-tab.active { background: rgba(139, 92, 246, 0.2); border-color: var(--primary); }
    .doc-content { display: none; }
    .doc-content.active { display: block; }
    
    @media (max-width: 768px) {
      .nav-content { gap: 1rem; }
      .nav-item { font-size: 0.9rem; }
      .stats-bar { gap: 2rem; }
      .screenshot-grid { grid-template-columns: 1fr; }
      .stats-row { flex-direction: column; }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-content">
      <h1>🤖 Al Does AI</h1>
      <p>Every prompt. Every action. Every dollar.</p>
      <div class="stats-bar">
        <div class="stat"><span class="stat-value">5</span><span class="stat-label">Prompts</span></div>
        <div class="stat"><span class="stat-value">28</span><span class="stat-label">Files</span></div>
        <div class="stat"><span class="stat-value">4K+</span><span class="stat-label">Lines</span></div>
        <div class="stat"><span class="stat-value">10</span><span class="stat-label">Screenshots</span></div>
        <div class="stat"><span class="stat-value" style="color: var(--accent);">$0</span><span class="stat-label">Invested</span></div>
      </div>
    </div>
  </header>

  <nav class="nav">
    <div class="nav-content">
      <div class="nav-item" onclick="showTab('actions')">🚨 Actions</div>
      <div class="nav-item" onclick="showTab('budget')">💰 Budget</div>
      <div class="nav-item" onclick="showTab('plan')">📅 The Plan</div>
      <div class="nav-item" onclick="showTab('screenshots')">📸 Screenshots</div>
      <div class="nav-item" onclick="showTab('conversations')">💬 Conversations</div>
      <div class="nav-item" onclick="showTab('docs')">📄 Documents</div>
    </div>
  </nav>

  <main class="main">
    <!-- Actions Tab -->
    <div id="actions" class="tab-content">
      <div class="card">
        <div class="card-title">🚨 Phase 1 Tasks — Digital Real Estate</div>
        <div id="task-list"></div>
        <div class="progress-container">
          <div class="progress-text">Your Progress: <span id="progress-text">0/6</span></div>
          <div class="progress-bar"><div class="progress-fill" id="progress-bar" style="width: 0%;"></div></div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-title">📋 ACTION REQUIRED — Immediate Tasks</div>
        <div class="content-display">
          <h2>Today (2026-03-05)</h2>
          <ol>
            <li><strong>Buy aldoesai.com domain</strong> — Cloudflare Registrar ($9.15)</li>
            <li><strong>Register @AlDoesAI everywhere</strong>:
              <ul>
                <li>Twitter/X — @AlDoesAI</li>
                <li>Instagram — @aldoesai</li>
                <li>TikTok — @aldoesai</li>
                <li>YouTube — "Al Does AI" channel</li>
                <li>LinkedIn — "Al Does AI" page</li>
                <li>GitHub — aldoesai org</li>
              </ul>
            </li>
            <li><strong>Create Substack</strong> — "Al Does AI" newsletter</li>
            <li><strong>Run showmeal</strong> — View and test dashboard</li>
          </ol>
          <p><em>Total time: ~1 hour | Total cost: $28</em></p>
        </div>
      </div>
    </div>

    <!-- Budget Tab -->
    <div id="budget" class="tab-content">
      <div class="card">
        <div class="card-title">💰 Running P&L</div>
        <div class="stats-row">
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
            <div class="stat-value">90</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">📊 Investment Timeline</div>
        <div class="timeline-container">
          <div class="timeline-bar"><div class="timeline-fill" style="width: 0%;"></div></div>
          <div class="timeline-labels">
            <span>Day 0</span>
            <span style="color: var(--accent);">Day 30: First $1</span>
            <span>Day 90: Break Even</span>
            <span style="color: var(--success);">Day 180: $1K/mo</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">💸 Investments</div>
        <table class="data-table">
          <thead><tr><th>Date</th><th>Item</th><th>Category</th><th>Cost</th></tr></thead>
          <tbody>
            <tr><td>2026-03-05</td><td>Mac mini runtime</td><td>Infrastructure</td><td>$0</td></tr>
            <tr><td>2026-03-05</td><td>Project setup + docs</td><td>Labor</td><td>$0</td></tr>
            <tr><td>2026-03-05</td><td>Domain: aldoesai.com</td><td>Digital Real Estate</td><td>$9.15</td></tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-title">🎯 Break-Even Calculator</div>
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

    <!-- Plan Tab -->
    <div id="plan" class="tab-content">
      <div class="card">
        <div class="card-title">📅 180-Day Transition Arc</div>
        <div class="content-display">
          ${plan}
        </div>
      </div>
    </div>

    <!-- Screenshots Tab -->
    <div id="screenshots" class="tab-content">
      <div class="card">
        <div class="card-title">📸 Visual Progress Log (${screenshots.length} images)</div>
        <div class="screenshot-grid">
          ${screenshotHTML}
        </div>
      </div>
    </div>

    <!-- Conversations Tab -->
    <div id="conversations" class="tab-content">
      <div class="card">
        <div class="card-title">💬 Complete Conversation History (All Prompts)</div>
        <div class="content-display">
          ${conversation}
        </div>
      </div>
      <div class="card">
        <div class="card-title">📸 Screenshots in Conversation</div>
        <div class="screenshot-grid">
          ${screenshotHTML}
        </div>
      </div>
    </div>

    <!-- Documents Tab -->
    <div id="docs" class="tab-content">
      <div class="card">
        <div class="card-title">📄 All Documents (${Object.keys(docs).length} files)</div>
        <div class="doc-nav">
          ${docNavHTML}
        </div>
        ${docContentHTML}
      </div>
    </div>
  </main>

  <script>
    const tasks = [
      { id: 'domains', title: 'Register 3 Domains', desc: 'aldoesai.com, .net, .org at Cloudflare', time: '10 min', cost: '$28', link: 'https://dash.cloudflare.com' },
      { id: 'twitter', title: 'Secure Twitter @AlDoesAI', desc: 'Create account and claim handle', time: '5 min', link: 'https://twitter.com' },
      { id: 'instagram', title: 'Secure Instagram @aldoesai', desc: 'Via mobile app', time: '5 min', link: null },
      { id: 'tiktok', title: 'Secure TikTok @aldoesai', desc: 'Via mobile app', time: '5 min', link: null },
      { id: 'youtube', title: 'Create YouTube Channel', desc: '"Al Does AI" with @AlDoesAI handle', time: '10 min', link: 'https://youtube.com' },
      { id: 'linkedin', title: 'Create LinkedIn Page', desc: 'For B2B presence', time: '10 min', link: 'https://linkedin.com' }
    ];

    function renderTasks() {
      const container = document.getElementById('task-list');
      container.innerHTML = tasks.map(t => {
        const isDone = localStorage.getItem('task_' + t.id) === 'true';
        return \`
          <div class="task-item \${isDone ? 'completed' : ''}" data-task="\${t.id}">
            <div class="task-checkbox \${isDone ? 'checked' : ''}" onclick="toggleTask('\${t.id}')"></div>
            <div>
              <div style="font-weight: 600;">\${t.title}</div>
              <div style="color: var(--text-muted); font-size: 0.9rem;">\${t.desc}</div>
              <div style="margin-top: 0.5rem; font-size: 0.85rem;">
                <span style="background: rgba(245, 158, 11, 0.2); color: var(--accent); padding: 0.25rem 0.5rem; border-radius: 4px; margin-right: 0.5rem; display: inline-block;">⏱️ \${t.time}</span>
                \${t.cost ? \`<span style="color: var(--accent);">\${t.cost}</span>\` : ''}
                \${t.link ? \`<a href="\${t.link}" target="_blank" style="color: var(--secondary); margin-left: 0.5rem;">Open →</a>\` : ''}
              </div>
            </div>
          </div>
        \`;
      }).join('');
      updateProgress();
    }

    function toggleTask(id) {
      const isDone = localStorage.getItem('task_' + id) === 'true';
      localStorage.setItem('task_' + id, isDone ? 'false' : 'true');
      renderTasks();
    }

    function updateProgress() {
      const done = tasks.filter(t => localStorage.getItem('task_' + t.id) === 'true').length;
      const pct = Math.round((done / tasks.length) * 100);
      document.getElementById('progress-text').textContent = done + '/' + tasks.length;
      document.getElementById('progress-bar').style.width = pct + '%';
    }

    function showTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      event.target.classList.add('active');
    }

    function showDoc(docId) {
      document.querySelectorAll('.doc-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.doc-content').forEach(el => {
        if (el.id === 'doc-' + docId) el.classList.add('active');
      });
      document.querySelectorAll('.doc-tab').forEach(el => el.classList.remove('active'));
      event.target.classList.add('active');
    }

    document.addEventListener('DOMContentLoaded', () => {
      renderTasks();
      document.querySelector('.nav-item').click();
    });
  </script>
</body>
</html>`;

// Write output
fs.writeFileSync(OUTPUT_FILE, html);

// Update stats
const stats = {
  prompts: 5,
  files: 28,
  lines: html.split('\n').length,
  screenshots: screenshots.length,
  lastUpdated: new Date().toISOString()
};
fs.writeFileSync(path.join(PROJECT_DIR, 'stats.json'), JSON.stringify(stats, null, 2));

console.log('');
console.log('✅ Dashboard V4 built successfully!');
console.log('   File: ' + OUTPUT_FILE);
console.log('   Size: ' + (html.length / 1024).toFixed(1) + ' KB');
console.log('   Lines: ' + stats.lines);
console.log('   Documents: ' + Object.keys(docs).length);
console.log('   Screenshots: ' + screenshots.length);
