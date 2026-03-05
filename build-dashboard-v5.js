#!/usr/bin/env node
/**
 * build-dashboard-v5.js — Dashboard V5 with Today tab and fixed screenshots
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const PROJECT_DIR = process.env.HOME + '/.openclaw/workspace/projects/al-does-ai';
const OUTPUT_FILE = path.join(PROJECT_DIR, 'dashboard', 'index.html');

console.log('🕸️  Webby: Building Dashboard V5');
console.log('==================================');
console.log('');

// Step 1: Convert markdown to HTML
function convertFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return marked.parse(content);
  } catch (e) {
    return '<p>Cannot load: ' + path.basename(filePath) + '</p>';
  }
}

console.log('📄 Converting documents...');

// Load all docs
const docs = {};
const docsDir = path.join(PROJECT_DIR, 'docs');
const contentDir = path.join(PROJECT_DIR, 'content');
const baseDir = PROJECT_DIR;

if (fs.existsSync(docsDir)) {
  fs.readdirSync(docsDir).forEach(f => {
    if (f.endsWith('.md')) docs[f] = convertFile(path.join(docsDir, f));
  });
}

if (fs.existsSync(contentDir)) {
  fs.readdirSync(contentDir).forEach(f => {
    if (f.endsWith('.md')) docs['content/' + f] = convertFile(path.join(contentDir, f));
  });
}

fs.readdirSync(baseDir).forEach(f => {
  if (f.endsWith('.md') && !f.startsWith('.')) {
    docs[f] = convertFile(path.join(baseDir, f));
  }
});

console.log('   Converted ' + Object.keys(docs).length + ' documents');

// Step 2: Get screenshots with encoding
console.log('📸 Loading screenshots...');
const screenshotsDir = path.join(PROJECT_DIR, 'assets', 'screenshots');
const screenshots = [];

if (fs.existsSync(screenshotsDir)) {
  fs.readdirSync(screenshotsDir)
    .filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
    .forEach(f => {
      screenshots.push({
        file: f,
        encoded: encodeURIComponent(f),
        display: f.replace('.png', '').replace('Screenshot ', '')
      });
    });
}

console.log('   Found ' + screenshots.length + ' screenshots');

// Step 3: Generate screenshot HTML
const screenshotHTML = screenshots.map(s => `
          <div class="screenshot-item">
            <img src="assets/screenshots/${s.encoded}" alt="${s.file}" loading="lazy"
                 onerror="this.style.display='none'; this.parentElement.style.opacity='0.3'">
            <div class="screenshot-meta">${s.display}</div>
          </div>`).join('');

console.log('   Generated screenshot gallery');

// Step 4: Build HTML
console.log('');
console.log('Building HTML...');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Al Does AI — Dashboard V5</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --primary: #8B5CF6; --secondary: #06B6D4; --accent: #F59E0B;
      --success: #10B981; --bg: #0F0F0F; --bg-elevated: #1A1A1A;
      --bg-card: #252525; --text: #F9FAFB; --text-muted: #9CA3AF;
      --border: #374151;
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
    .nav-content { max-width: 1400px; margin: 0 auto; display: flex; gap: 1.5rem; flex-wrap: wrap; }
    .nav-item { padding: 1rem 0; border-bottom: 2px solid transparent; cursor: pointer;
                opacity: 0.6; transition: all 0.2s; white-space: nowrap; }
    .nav-item:hover, .nav-item.active { opacity: 1; border-bottom-color: var(--secondary); }
    .main { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .card { background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border);
            padding: 1.5rem; margin-bottom: 1.5rem; }
    .card-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; color: var(--secondary); }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    
    /* Today tab specific */
    .today-header { background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                      padding: 2rem; border-radius: 12px; margin-bottom: 1.5rem; }
    .today-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
    .today-subtitle { font-size: 1rem; opacity: 0.9; }
    .today-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    @media (max-width: 900px) { .today-grid { grid-template-columns: 1fr; } }
    
    /* Tasks */
    .task-item { display: flex; gap: 1rem; padding: 1rem; background: var(--bg-elevated);
                 border-radius: 8px; margin-bottom: 0.75rem; border-left: 4px solid var(--accent); }
    .task-item.completed { border-color: var(--success); opacity: 0.6; }
    .task-item.jim { border-left-color: var(--secondary); }
    .task-item.al { border-left-color: var(--primary); }
    .task-checkbox { width: 24px; height: 24px; border: 2px solid var(--accent); border-radius: 4px;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0; }
    .task-checkbox.checked { background: var(--success); border-color: var(--success); }
    .task-checkbox.checked::after { content: '✓'; color: white; font-weight: bold; }
    .task-owner { font-size: 0.75rem; text-transform: uppercase; padding: 0.25rem 0.5rem;
                  border-radius: 4px; margin-left: auto; }
    .task-owner.jim { background: rgba(6, 182, 212, 0.2); color: var(--secondary); }
    .task-owner.al { background: rgba(139, 92, 246, 0.2); color: var(--primary); }
    
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
    
    /* Content display */
    .content-display { max-height: 800px; overflow-y: auto; padding-right: 1rem; }
    .content-display h1 { color: var(--secondary); margin-bottom: 1rem; font-size: 1.8rem; }
    .content-display h2 { color: var(--primary); margin: 1.5rem 0 0.75rem; font-size: 1.4rem; }
    .content-display h3 { color: var(--accent); margin: 1rem 0 0.5rem; font-size: 1.1rem; }
    .content-display p { margin-bottom: 1rem; line-height: 1.7; }
    .content-display table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    .content-display th, .content-display td { padding: 0.75rem; text-align: left;
                                              border-bottom: 1px solid var(--border); }
    .content-display th { background: var(--bg-elevated); font-weight: 500; }
    .content-display tr:hover { background: rgba(255,255,255,0.05); }
    .content-display strong { color: var(--text); }
    
    /* Document tabs */
    .doc-nav { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .doc-tab { padding: 0.5rem 1rem; background: var(--bg-elevated); border-radius: 6px;
               cursor: pointer; font-size: 0.85rem; transition: all 0.2s; border: 1px solid transparent; }
    .doc-tab:hover { background: rgba(255,255,255,0.1); }
    .doc-tab.active { background: rgba(139, 92, 246, 0.2); border-color: var(--primary); }
    .doc-content { display: none; }
    .doc-content.active { display: block; }
    
    /* Week sections */
    .week-section { margin-bottom: 1.5rem; }
    .week-header { background: var(--bg-elevated); padding: 1rem; border-radius: 8px;
                   cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
    .week-content { display: none; padding: 1rem; border: 1px solid var(--border);
                    border-top: none; border-radius: 0 0 8px 8px; }
    .week-content.expanded { display: block; }
    
    /* Machine flow */
    .machine-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    @media (max-width: 900px) { .machine-grid { grid-template-columns: 1fr; } }
    
    /* Progress */
    .progress-container { margin-top: 2rem; }
    .progress-bar { height: 12px; background: var(--bg); border-radius: 6px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); transition: width 0.3s; }
  
  </style>
</head>
<body>
  <header class="header">
    <div class="header-content">
      <h1>🤖 Al Does AI</h1>
      <p>Every prompt. Every action. Every dollar.</p>
      <div class="stats-bar">
        <div class="stat"><span class="stat-value">5</span><span class="stat-label">Prompts</span></div>
        <div class="stat"><span class="stat-value">33</span><span class="stat-label">Files</span></div>
        <div class="stat"><span class="stat-value">5K+</span><span class="stat-label">Lines</span></div>
        <div class="stat"><span class="stat-value">${screenshots.length}</span><span class="stat-label">Screenshots</span></div>
        <div class="stat"><span class="stat-value" style="color: var(--accent);">$0</span><span class="stat-label">Invested</span></div>
      </div>
    </div>
  </header>

  <nav class="nav">
    <div class="nav-content">
      <div class="nav-item active" onclick="showTab('today')">🎯 Today</div>
      <div class="nav-item" onclick="showTab('plan')">📅 30-Day Plan</div>
      <div class="nav-item" onclick="showTab('machine')">🔄 Machine</div>
      <div class="nav-item" onclick="showTab('budget')">💰 Budget</div>
      <div class="nav-item" onclick="showTab('screenshots')">📸 Screenshots</div>
      <div class="nav-item" onclick="showTab('conversations')">💬 Conversations</div>
      <div class="nav-item" onclick="showTab('docs')">📄 Documents</div>
    </div>
  </nav>

  <main class="main">
    <!-- TODAY TAB -->
    <div id="today" class="tab-content active">
      <div class="today-header">
        <div class="today-title">🎯 TODAY — Day 1</div>
        <div class="today-subtitle">Thursday, March 5, 2026 | Phase: Ignition | Week 1: Foundation</div>
      </div>
      
      <div class="today-grid">
        <div class="card">
          <div class="card-title">👤 Jim's Tasks</div>
          <div id="jim-tasks">
            <!-- Populated by JS -->
          </div>
        </div>
        
        <div class="card">
          <div class="card-title">🤖 Al's Tasks</div>
          <div id="al-tasks">
            <!-- Populated by JS -->
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-title">📝 Content Today</div>
        <div class="content-display">
          <p><strong>Status:</strong> Waiting for Jim's Day 1 thoughts</p>
          <p><strong>Planned content:</strong></p>
          <ul>
            <li>🐦 <strong>Twitter:</strong> "Day 1: $0 Setup" thread</li>
            <li>💼 <strong>LinkedIn:</strong> Vision post — AI x human collaboration</li>
            <li>🎬 <strong>TikTok:</strong> Behind-the-scenes of setup</li>
            <li>📧 <strong>Substack:</strong> Week 1 preview (draft)</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 30-DAY PLAN TAB -->
    <div id="plan" class="tab-content">
      <div class="card">
        <div class="card-title">📅 30-Day Transition Arc</div>
        <div id="plan-content" class="content-display">
          ${docs['30_DAY_PLAN.md'] || '<p>30-Day Plan loading...</p>'}
        </div>
      </div>
    </div>

    <!-- MACHINE TAB -->
    <div id="machine" class="tab-content">
      <div class="machine-grid">
        <div class="card">
          <div class="card-title">🤖 Agent Team</div>
          <div class="content-display" style="max-height: 400px;">
            ${docs['AGENT_TEAM_ROSTER.md'] || '<p>Agent roster loading...</p>'}
          </div>
        </div>
        
        <div class="card">
          <div class="card-title">🔍 Research Queue</div>
          <div class="content-display" style="max-height: 400px;">
            ${docs['RESEARCH_TOPICS.md'] || '<p>Research topics loading...</p>'}
          </div>
        </div>
        
        <div class="card">
          <div class="card-title">📅 Content Calendar</div>
          <div class="content-display" style="max-height: 400px;">
            ${docs['CONTENT_CALENDAR.md'] || '<p>Calendar loading...</p>'}
          </div>
        </div>
      </div>
    </div>

    <!-- BUDGET TAB -->
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
      
      ${docs['INVESTMENT_LEDGER.md'] ? '<div class="card"><div class="card-title">📊 Full Ledger</div><div class="content-display">' + docs['INVESTMENT_LEDGER.md'] + '</div></div>' : ''}
    </div>

    <!-- SCREENSHOTS TAB -->
    <div id="screenshots" class="tab-content">
      <div class="card">
        <div class="card-title">📸 Visual Progress Log (${screenshots.length} images)</div>
        <div class="screenshot-grid">
          ${screenshotHTML}
        </div>
      </div>
    </div>

    <!-- CONVERSATIONS TAB -->
    <div id="conversations" class="tab-content">
      <div class="card">
        <div class="card-title">💬 Complete Conversation History</div>
        <div class="content-display">
          ${docs['content/FULL_CONVERSATION_LOG.md'] || '<p>Conversation log loading...</p>'}
        </div>
      </div>
      <div class="card">
        <div class="card-title">📸 Screenshots in Thread</div>
        <div class="screenshot-grid">
          ${screenshotHTML}
        </div>
      </div>
    </div>

    <!-- DOCUMENTS TAB -->
    <div id="docs" class="tab-content">
      <div class="card">
        <div class="card-title">📄 All Documents (${Object.keys(docs).length} files)</div>
        <div class="doc-nav">
          ${Object.keys(docs).map((f, i) => 
            '<div class="doc-tab ' + (i === 0 ? 'active' : '') + '" onclick="showDoc(' + "'" + f.replace(/[^a-zA-Z0-9]/g, '-') + "'" + ')">' + f + '</div>'
          ).join('')}
        </div>
        ${Object.entries(docs).map(([f, content], i) => 
          '<div class="doc-content content-display ' + (i === 0 ? 'active' : '') + '" id="doc-' + f.replace(/[^a-zA-Z0-9]/g, '-') + '">' + content + '</div>'
        ).join('')}
      </div>
    </div>
  </main>

  <script>
    // Today's tasks
    const jimTasks = [
      { id: 'jim-domain', title: 'Buy aldoesai.com', time: '10 min', output: 'Domain secured' },
      { id: 'jim-twitter', title: 'Register Twitter @AlDoesAI', time: '5 min', output: 'Handle claimed' },
      { id: 'jim-insta', title: 'Register Instagram @aldoesai', time: '5 min', output: 'Handle claimed' },
      { id: 'jim-tiktok', title: 'Register TikTok @aldoesai', time: '5 min', output: 'Handle claimed' },
      { id: 'jim-youtube', title: 'Create YouTube channel', time: '10 min', output: 'Channel live' },
      { id: 'jim-linkedin', title: 'Create LinkedIn page', time: '10 min', output: 'Page published' },
      { id: 'jim-github', title: 'Create GitHub org "aldoesai"', time: '10 min', output: 'Org created' },
      { id: 'jim-screenshots', title: 'Add screenshots to Documents/AlDoesAI/', time: 'ongoing', output: 'Visual log' }
    ];
    
    const alTasks = [
      { id: 'al-v4', title: 'Build dashboard v4', time: '2 hrs', output: 'Dashboard live', done: true },
      { id: 'al-fix', title: 'Fix screenshot encoding', time: '30 min', output: 'Images render' },
      { id: 'al-v5', title: 'Build dashboard v5', time: '3 hrs', output: 'New structure', done: true },
      { id: 'al-plan', title: 'Create 30-day plan docs', time: '1 hr', output: 'Plan published', done: true },
      { id: 'al-agents', title: 'Create agent roster', time: '30 min', output: 'Team defined', done: true },
      { id: 'al-research', title: 'Create research topics', time: '30 min', output: 'Topics queued', done: true },
      { id: 'al-calendar', title: 'Create content calendar', time: '30 min', output: 'Calendar linked', done: true }
    ];

    function renderTasks() {
      const jimContainer = document.getElementById('jim-tasks');
      const alContainer = document.getElementById('al-tasks');
      
      jimContainer.innerHTML = jimTasks.map(t => {
        const isDone = localStorage.getItem('task_' + t.id) === 'true';
        return '<div class="task-item ' + (isDone ? 'completed' : '') + ' jim">' +
          '<div class="task-checkbox ' + (isDone ? 'checked' : '') + '" onclick="toggleTask(\\'' + t.id + '\\')"></div>' +
          '<div>' +
            '<div style="font-weight: 600;">' + t.title + '</div>' +
            '<div style="color: var(--text-muted); font-size: 0.85rem;">' + t.time + ' → ' + t.output + '</div>' +
          '</div>' +
          '<span class="task-owner jim">Jim</span>' +
        '</div>';
      }).join('');
      
      alContainer.innerHTML = alTasks.map(t => {
        const isDone = localStorage.getItem('task_' + t.id) === 'true' || t.done;
        return '<div class="task-item ' + (isDone ? 'completed' : '') + ' al">' +
          '<div class="task-checkbox ' + (isDone ? 'checked' : '') + '" onclick="toggleTask(\\'' + t.id + '\\')"></div>' +
          '<div>' +
            '<div style="font-weight: 600;">' + t.title + '</div>' +
            '<div style="color: var(--text-muted); font-size: 0.85rem;">' + t.time + ' → ' + t.output + '</div>' +
          '</div>' +
          '<span class="task-owner al">Al</span>' +
        '</div>';
      }).join('');
    }

    function toggleTask(id) {
      const isDone = localStorage.getItem('task_' + id) === 'true';
      localStorage.setItem('task_' + id, isDone ? 'false' : 'true');
      renderTasks();
    }

    function showTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      event.target.classList.add('active');
    }

    function showDoc(docId) {
      document.querySelectorAll('.doc-content').forEach(el => el.classList.remove('active'));
      document.getElementById('doc-' + docId).classList.add('active');
      document.querySelectorAll('.doc-tab').forEach(el => el.classList.remove('active'));
      event.target.classList.add('active');
    }

    document.addEventListener('DOMContentLoaded', () => {
      renderTasks();
    });
  </script>
</body>
</html>`;

// Write output
fs.writeFileSync(OUTPUT_FILE, html);

// Update stats
const stats = {
  prompts: 5,
  files: 33,
  lines: html.split('\\n').length,
  screenshots: screenshots.length,
  lastUpdated: new Date().toISOString()
};
fs.writeFileSync(path.join(PROJECT_DIR, 'stats.json'), JSON.stringify(stats, null, 2));

console.log('');
console.log('✅ Dashboard V5 built successfully!');
console.log('   File: ' + OUTPUT_FILE);
console.log('   Size: ' + (html.length / 1024).toFixed(1) + ' KB');
console.log('   Lines: ' + stats.lines);
console.log('   Documents: ' + Object.keys(docs).length);
console.log('   Screenshots: ' + screenshots.length);
