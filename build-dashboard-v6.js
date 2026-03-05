#!/usr/bin/env node
/**
 * build-dashboard-v6.js — Warm Paper Theme, matching Claude intro aesthetic
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const PROJECT_DIR = process.env.HOME + '/.openclaw/workspace/projects/al-does-ai';
const OUTPUT_FILE = path.join(PROJECT_DIR, 'dashboard', 'index.html');

console.log('🕸️  Webby: Building Dashboard V6 (Warm Paper Theme)');
console.log('====================================================');

// Convert markdown to HTML
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

console.log('   Converted ' + Object.keys(docs).length + ' documents');

// Get screenshots
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

const screenshotHTML = screenshots.map(s => `
          <div class="screenshot-item">
            <img src="assets/screenshots/${s.encoded}" alt="${s.file}" loading="lazy">
          </div>`).join('');

// Build HTML
console.log('');
console.log('Building HTML...');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Al Does AI — Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;1,9..144,300;1,9..144,400&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      --bg: #f7f4ef;
      --bg-elevated: #eeeae3;
      --bg-card: #faf8f4;
      --text: #1a1814;
      --text-muted: #3a3830;
      --primary: #1e4a7a;
      --secondary: #b03e10;
      --accent: #b03e10;
      --border: #c8c3ba;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Fraunces', serif;
      min-height: 100vh;
      line-height: 1.7;
    }

    /* MASTHEAD */
    .masthead {
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      padding: 24px 32px;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }

    .logo {
      font-family: 'DM Mono', monospace;
      font-size: 14px;
      color: var(--text-muted);
      letter-spacing: 0.08em;
    }

    .logo a {
      color: var(--text);
      text-decoration: none;
    }

    .logo span { color: var(--accent); font-weight: 600; }

    .issue {
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      letter-spacing: 0.12em;
    }

    /* NAV */
    .nav {
      background: var(--bg-elevated);
      border-bottom: 1px solid var(--border);
      padding: 0 32px;
      overflow-x: auto;
    }

    .nav-content {
      display: flex;
      gap: 32px;
    }

    .nav-item {
      padding: 16px 0;
      color: var(--text-muted);
      cursor: pointer;
      font-family: 'DM Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.08em;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .nav-item:hover, .nav-item.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    /* MAIN */
    .main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 48px 32px;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 32px;
      margin-bottom: 24px;
    }

    .card-title {
      font-size: 13px;
      font-family: 'DM Mono', monospace;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--secondary);
      margin-bottom: 24px;
    }

    .tab-content { display: none; }
    .tab-content.active { display: block; }

    /* TODAY TAB */
    .today-header {
      margin-bottom: 40px;
    }

    .today-title {
      font-size: clamp(36px, 6vw, 64px);
      font-weight: 300;
      font-style: italic;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }

    .today-subtitle {
      font-family: 'DM Mono', monospace;
      font-size: 13px;
      color: var(--text-muted);
      letter-spacing: 0.08em;
    }

    .today-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    @media (max-width: 900px) {
      .today-grid { grid-template-columns: 1fr; }
    }

    /* TASKS */
    .task-item {
      display: flex;
      gap: 16px;
      padding: 16px;
      background: var(--bg-elevated);
      border-left: 3px solid var(--secondary);
      margin-bottom: 12px;
    }

    .task-item.completed {
      opacity: 0.5;
      border-left-color: var(--border);
    }

    .task-checkbox {
      width: 20px;
      height: 20px;
      border: 2px solid var(--secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: transparent;
    }

    .task-checkbox.checked {
      background: var(--secondary);
      color: white;
    }

    .task-owner {
      font-family: 'DM Mono', monospace;
      font-size: 10px;
      text-transform: uppercase;
      margin-left: auto;
      padding: 4px 8px;
      background: var(--bg);
    }

    /* CONTENT DISPLAY */
    .content-display {
      max-height: 600px;
      overflow-y: auto;
    }

    .content-display h1 {
      font-size: 24px;
      margin-bottom: 16px;
      font-weight: 400;
    }

    .content-display h2 {
      font-size: 18px;
      margin: 24px 0 12px;
      font-weight: 400;
      color: var(--text-muted);
    }

    .content-display p {
      margin-bottom: 16px;
    }

    .content-display table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 14px;
    }

    .content-display th, .content-display td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid var(--border);
      font-family: 'DM Mono', monospace;
      font-size: 12px;
    }

    .content-display th {
      background: var(--bg-elevated);
    }

    /* SCREENSHOTS */
    .screenshot-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .screenshot-item {
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 4px;
      overflow: hidden;
    }

    .screenshot-item img {
      width: 100%;
      display: block;
    }

    /* DOCS */
    .doc-nav {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;
      overflow-x: auto;
      padding-bottom: 8px;
    }

    .doc-tab {
      padding: 8px 16px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      cursor: pointer;
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      white-space: nowrap;
    }

    .doc-tab:hover, .doc-tab.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .doc-content { display: none; }
    .doc-content.active { display: block; }
  </style>
</head>
<body>
  <header class="masthead">
    <div class="logo"><a href="../index.html"><span>Al</span> Does AI</a></div>
    <div class="issue">Dashboard — Day 001</div>
  </header>

  <nav class="nav">
    <div class="nav-content">
      <div class="nav-item active" onclick="showTab('today')">🎯 Today</div>
      <div class="nav-item" onclick="showTab('plan')">📅 30-Day Plan</div>
      <div class="nav-item" onclick="showTab('machine')">🔄 Machine</div>
      <div class="nav-item" onclick="showTab('budget')">💰 Budget</div>
      <div class="nav-item" onclick="showTab('screenshots')">📸 Screenshots (${screenshots.length})</div>
      <div class="nav-item" onclick="showTab('conversations')">💬 Conversations</div>
      <div class="nav-item" onclick="showTab('docs')">📄 Documents (${Object.keys(docs).length})</div>
    </div>
  </nav>

  <main class="main">
    <!-- TODAY TAB -->
    <div id="today" class="tab-content active">
      <div class="today-header">
        <div class="today-title">🎯 Day 001</div>
        <div class="today-subtitle">Thursday, March 5, 2026 · Phase: Ignition · Week 1: Foundation</div>
      </div>
      
      <div class="today-grid">
        <div class="card">
          <div class="card-title">Jim's Tasks</div>
          <div id="jim-tasks"></div>
        </div>
        
        <div class="card">
          <div class="card-title">Al's Tasks</div>
          <div id="al-tasks"></div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-title">Content Today</div>
        <div class="content-display">
          <p><strong>Status:</strong> Content suite created — ready for Jim recording</p>
          <ul style="margin-left: 20px; line-height: 2;">
            <li>🐦 <strong>Twitter thread</strong> — 10 tweets ready</li>
            <li>💼 <strong>LinkedIn post</strong> — Long-form ready</li>
            <li>📧 <strong>Substack essay</strong> — 2,100 words ready</li>
            <li>🎵 <strong>TikTok script</strong> — 60 sec ready</li>
            <li>🎬 <strong>YouTube trailer</strong> — Script ready</li>
          </ul>
          <p style="margin-top: 16px;"><strong>Next:</strong> Jim records video → Al distributes across platforms</p>
        </div>
      </div>
    </div>

    <!-- PLAN TAB -->
    <div id="plan" class="tab-content">
      <div class="card">
        <div class="card-title">30-Day Transition Arc</div>
        <div class="content-display">${docs['30_DAY_PLAN.md'] || '<p>Loading...</p>'}</div>
      </div>
    </div>

    <!-- MACHINE TAB -->
    <div id="machine" class="tab-content">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px;">
        <div class="card">
          <div class="card-title">Agent Team</div>
          <div class="content-display" style="max-height: 400px;">${docs['AGENT_TEAM_ROSTER.md'] || '<p>Loading...</p>'}</div>
        </div>
        
        <div class="card">
          <div class="card-title">Research Queue</div>
          <div class="content-display" style="max-height: 400px;">${docs['RESEARCH_TOPICS.md'] || '<p>Loading...</p>'}</div>
        </div>
        
        <div class="card">
          <div class="card-title">Content Calendar</div>
          <div class="content-display" style="max-height: 400px;">${docs['CONTENT_CALENDAR.md'] || '<p>Loading...</p>'}</div>
        </div>
      </div>
    </div>

    <!-- BUDGET TAB -->
    <div id="budget" class="tab-content">
      <div class="card">
        <div class="card-title">Running P&L</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px;">
          <div>
            <div style="font-size: 36px; font-weight: 300; color: var(--secondary);">$0</div>
            <div style="font-size: 12px; font-family: 'DM Mono', monospace; color: var(--text-muted);">Total Invested</div>
          </div>
          <div>
            <div style="font-size: 36px; font-weight: 300; color: var(--primary);">$0</div>
            <div style="font-size: 12px; font-family: 'DM Mono', monospace; color: var(--text-muted);">Total Revenue</div>
          </div>
          <div>
            <div style="font-size: 36px; font-weight: 300;">$0</div>
            <div style="font-size: 12px; font-family: 'DM Mono', monospace; color: var(--text-muted);">Net</div>
          </div>
          <div>
            <div style="font-size: 36px; font-weight: 300;">90</div>
            <div style="font-size: 12px; font-family: 'DM Mono', monospace; color: var(--text-muted);">Days to Break Even</div>
          </div>
        </div>
      </div>
      ${docs['INVESTMENT_LEDGER.md'] ? '<div class="card"><div class="card-title">Full Ledger</div><div class="content-display">' + docs['INVESTMENT_LEDGER.md'] + '</div></div>' : ''}
    </div>

    <!-- SCREENSHOTS TAB -->
    <div id="screenshots" class="tab-content">
      <div class="card">
        <div class="card-title">Visual Progress Log</div>
        <div class="screenshot-grid">${screenshotHTML}</div>
      </div>
    </div>

    <!-- CONVERSATIONS TAB -->
    <div id="conversations" class="tab-content">
      <div class="card">
        <div class="card-title">Complete Conversation History</div>
        <div class="content-display">${docs['content/FULL_CONVERSATION_LOG.md'] || '<p>Loading...</p>'}</div>
      </div>
      <div class="card">
        <div class="card-title">Screenshots in Thread</div>
        <div class="screenshot-grid">${screenshotHTML}</div>
      </div>
    </div>

    <!-- DOCS TAB -->
    <div id="docs" class="tab-content">
      <div class="card">
        <div class="card-title">All Documents</div>
        <div class="doc-nav">
          ${Object.keys(docs).map((f, i) => 
            '<div class="doc-tab ' + (i === 0 ? 'active' : '') + '" onclick="showDoc(' + "'" + f.replace(/[^a-zA-Z0-9]/g, '-') + "'" + ')" style="cursor:pointer">' + f + '</div>'
          ).join('')}
        </div>
        ${Object.entries(docs).map(([f, content], i) => 
          '<div class="doc-content content-display ' + (i === 0 ? 'active' : '') + '" id="doc-' + f.replace(/[^a-zA-Z0-9]/g, '-') + '">' + content + '</div>'
        ).join('')}
      </div>
    </div>
  </main>

  <script>
    const jimTasks = [
      { id: 'domain', title: 'Buy aldoesai.com', time: '10 min', output: 'Domain secured' },
      { id: 'twitter', title: 'Register Twitter @AlDoesAI', time: '5 min', output: 'Handle claimed' },
      { id: 'instagram', title: 'Register Instagram @aldoesai', time: '5 min', output: 'Handle claimed' },
      { id: 'tiktok', title: 'Register TikTok @aldoesai', time: '5 min', output: 'Handle claimed' },
      { id: 'youtube', title: 'Create YouTube channel', time: '10 min', output: 'Channel live' },
      { id: 'linkedin', title: 'Create LinkedIn page', time: '10 min', output: 'Page published' },
      { id: 'github', title: 'Create GitHub org "aldoesai"', time: '10 min', output: 'Org created' },
      { id: 'screenshots', title: 'Add screenshots to Documents/AlDoesAI/', time: 'ongoing', output: 'Visual log' }
    ];
    
    const alTasks = [
      { id: 'v6', title: 'Build dashboard V6 (warm paper theme)', time: '2 hrs', output: 'Theme updated', done: true },
      { id: 'homepage', title: 'Create homepage with intro', time: '30 min', output: 'Homepage live', done: true },
      { id: 'twitter-thread', title: 'Draft Twitter thread for Day 001', time: '45 min', output: '10 tweets ready', done: true },
      { id: 'linkedin-post', title: 'Draft LinkedIn post', time: '30 min', output: 'Post ready', done: true },
      { id: 'substack', title: 'Draft Substack essay', time: '1 hr', output: 'Essay ready', done: true },
      { id: 'tiktok-script', title: 'Write TikTok script', time: '30 min', output: '60s script ready', done: true },
      { id: 'youtube-script', title: 'Write YouTube trailer script', time: '45 min', output: 'Script ready', done: true },
      { id: 'skills-doc', title: 'Document agent skills', time: '1 hr', output: 'Skills specified', done: true }
    ];

    function renderTasks() {
      document.getElementById('jim-tasks').innerHTML = jimTasks.map(t => {
        const isDone = localStorage.getItem('task_' + t.id) === 'true';
        return '<div class="task-item ' + (isDone ? 'completed' : '') + '">' +
          '<div class="task-checkbox ' + (isDone ? 'checked' : '') + '" onclick="toggleTask(\\'' + t.id + '\\')">' + (isDone ? '✓' : '') + '</div>' +
          '<div style="flex:1">' +
            '<div style="font-weight:400;">' + t.title + '</div>' +
            '<div style="color: var(--text-muted); font-size:13px; margin-top:4px;">' + t.time + ' → ' + t.output + '</div>' +
          '</div>' +
          '<span class="task-owner">Jim</span>' +
        '</div>';
      }).join('');
      
      document.getElementById('al-tasks').innerHTML = alTasks.map(t => {
        const isDone = localStorage.getItem('task_' + t.id) === 'true' || t.done;
        return '<div class="task-item ' + (isDone ? 'completed' : '') + '">' +
          '<div class="task-checkbox ' + (isDone ? 'checked' : '') + '" onclick="toggleTask(\\'' + t.id + '\\')">' + (isDone ? '✓' : '') + '</div>' +
          '<div style="flex:1">' +
            '<div style="font-weight:400;">' + t.title + '</div>' +
            '<div style="color: var(--text-muted); font-size:13px; margin-top:4px;">' + t.time + ' → ' + t.output + '</div>' +
          '</div>' +
          '<span class="task-owner">Al</span>' +
        '</div>';
      }).join('');
    }

    function toggleTask(id) {
      const isDone = localStorage.getItem('task_' + id) === 'true';
      localStorage.setItem('task_' + id, !isDone);
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

    document.addEventListener('DOMContentLoaded', renderTasks);
  </script>
</body>
</html>`;

fs.writeFileSync(OUTPUT_FILE, html);

const stats = {
  prompts: 6,
  files: 48,
  lines: html.split('\n').length,
  screenshots: screenshots.length,
  lastUpdated: new Date().toISOString()
};
fs.writeFileSync(path.join(PROJECT_DIR, 'stats.json'), JSON.stringify(stats, null, 2));

console.log('');
console.log('✅ Dashboard V6 built!');
console.log('   File: ' + OUTPUT_FILE);
console.log('   Size: ' + (html.length / 1024).toFixed(1) + ' KB');
console.log('   Screenshots: ' + screenshots.length);
