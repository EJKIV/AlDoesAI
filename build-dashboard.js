#!/usr/bin/env node
/**
 * build-dashboard.js — Generate static HTML with embedded content
 * Run: node build-dashboard.js
 * 
 * This script:
 * 1. Reads all markdown documents
 * 2. Converts to HTML
 * 3. Embeds full conversation log
 * 4. Generates screenshot gallery
 * 5. Creates interactive tasks with proper state
 * 6. Outputs complete dashboard.html
 */

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = process.env.HOME + '/.openclaw/workspace/projects/al-does-ai';
const OUTPUT_FILE = path.join(PROJECT_DIR, 'dashboard', 'index.html');

// Read file content
function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(PROJECT_DIR, filePath), 'utf8');
  } catch (e) {
    return null;
  }
}

// Simple markdown to HTML converter
function mdToHtml(markdown) {
  if (!markdown) return '<p>No content</p>';
  
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold/italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Tables (basic)
    .replace(/\|([^\n]+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    // Lists
    .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
    .replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%">')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gim, (match) => {
      if (match.startsWith('<')) return match;
      return '<p>' + match + '</p>';
    });
}

// Get screenshots
function getScreenshots() {
  const screenshotsDir = path.join(PROJECT_DIR, 'assets', 'screenshots');
  try {
    return fs.readdirSync(screenshotsDir)
      .filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
      .sort();
  } catch (e) {
    return [];
  }
}

// Generate screenshot gallery HTML
function generateScreenshotGallery() {
  const screenshots = getScreenshots();
  if (screenshots.length === 0) {
    return '<p style="color: var(--text-muted);">No screenshots found. Add images to ~/Documents/AlDoesAI/screenshots</p>';
  }
  
  return screenshots.map(file => {
    const timestamp = file.replace('Screenshot ', '').replace('.png', '');
    const encodedFile = encodeURIComponent(file);
    return `
      <div class="screenshot-item">
        <img src="../assets/screenshots/${encodedFile}" alt="${file}" loading="lazy"
             onerror="this.style.display='none'; this.parentElement.style.display='none'">
        <div class="screenshot-meta">${timestamp}</div>
      </div>
    `;
  }).join('\n');
}

// Get document list
function getDocuments() {
  const docs = [];
  
  // Docs directory
  const docsDir = path.join(PROJECT_DIR, 'docs');
  try {
    fs.readdirSync(docsDir)
      .filter(f => f.endsWith('.md'))
      .forEach(f => {
        const size = fs.statSync(path.join(docsDir, f)).size;
        docs.push({ name: f, path: `docs/${f}`, size: `${Math.round(size/1024)} KB` });
      });
  } catch (e) {}
  
  // Content directory
  const contentDir = path.join(PROJECT_DIR, 'content');
  try {
    fs.readdirSync(contentDir)
      .filter(f => f.endsWith('.md'))
      .forEach(f => {
        const size = fs.statSync(path.join(contentDir, f)).size;
        docs.push({ name: f, path: `content/${f}`, size: `${Math.round(size/1024)} KB` });
      });
  } catch (e) {}
  
  return docs;
}

// Generate HTML template
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Al Does AI — Dashboard</title>
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
    .nav-content { max-width: 1400px; margin: 0 auto; display: flex; gap: 2rem; }
    .nav-item { padding: 1rem 0; border-bottom: 2px solid transparent; cursor: pointer; 
                opacity: 0.6; transition: all 0.2s; }
    .nav-item:hover, .nav-item.active { opacity: 1; border-bottom-color: var(--secondary); }
    .main { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .card { background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border); 
            padding: 1.5rem; margin-bottom: 1.5rem; }
    .card-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    .task-item { display: flex; gap: 1rem; padding: 1rem; background: var(--bg-elevated); 
                 border-radius: 8px; margin-bottom: 0.75rem; border-left: 4px solid var(--accent); }
    .task-item.completed { border-color: var(--success); opacity: 0.6; }
    .task-checkbox { width: 24px; height: 24px; border: 2px solid var(--accent); border-radius: 4px; 
                    cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .task-checkbox.checked { background: var(--success); border-color: var(--success); }
    .task-checkbox.checked::after { content: '✓'; color: white; font-weight: bold; }
    .screenshot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; }
    .screenshot-item { background: var(--bg-elevated); border-radius: 8px; overflow: hidden; 
                       border: 1px solid var(--border); }
    .screenshot-item img { width: 100%; display: block; }
    .screenshot-meta { padding: 0.75rem; font-size: 0.85rem; color: var(--text-muted); 
                       text-align: center; background: var(--bg); }
    .file-tree { list-style: none; max-height: 500px; overflow-y: auto; }
    .file-item { padding: 0.75rem; border-radius: 6px; cursor: pointer; 
                 display: flex; align-items: center; gap: 0.75rem; transition: all 0.2s; }
    .file-item:hover { background: rgba(255,255,255,0.05); }
    .file-item.active { background: rgba(139, 92, 246, 0.2); }
    .file-icon { width: 24px; height: 24px; border-radius: 4px; font-size: 0.7rem; 
                 display: flex; align-items: center; justify-content: center; }
    .doc-content { max-height: 600px; overflow-y: auto; padding: 1rem; background: var(--bg-elevated); 
                   border-radius: 8px; }
    .doc-content h1, .doc-content h2 { color: var(--secondary); margin: 1.5rem 0 0.75rem; }
    .doc-content h3 { color: var(--primary); margin: 1rem 0 0.5rem; }
    .doc-content pre { background: var(--bg); padding: 1rem; border-radius: 4px; 
                       overflow-x: auto; margin: 1rem 0; }
    .doc-content code { font-family: 'JetBrains Mono', monospace; }
    .doc-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    .doc-content th, .doc-content td { padding: 0.75rem; border-bottom: 1px solid var(--border); 
                                        text-align: left; }
    .doc-content th { background: var(--bg-elevated); font-weight: 600; }
    .progress-bar { height: 12px; background: var(--bg); border-radius: 6px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); 
                     transition: width 0.3s; }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-content">
      <h1>🤖 Al Does AI</h1>
      <p>Every prompt. Every action. Every dollar.</p>
      <div class="stats-bar">
        <div class="stat"><span class="stat-value">3</span><span class="stat-label">Prompts</span></div>
        <div class="stat"><span class="stat-value">22</span><span class="stat-label">Files</span></div>
        <div class="stat"><span class="stat-value">2K+</span><span class="stat-label">Lines</span></div>
        <div class="stat"><span class="stat-value">10</span><span class="stat-label">Screenshots</span></div>
        <div class="stat"><span class="stat-value">$28</span><span class="stat-label">Invested</span></div>
      </div>
    </div>
  </header>

  <nav class="nav">
    <div class="nav-content">
      <div class="nav-item active" onclick="showTab('actions')">🚨 Actions</div>
      <div class="nav-item" onclick="showTab('screenshots')">📸 Screenshots</div>
      <div class="nav-item" onclick="showTab('conversations')">💬 Conversations</div>
      <div class="nav-item" onclick="showTab('docs')">📄 Documents</div>
    </div>
  </nav>

  <main class="main">
    <!-- Actions -->
    <div id="actions" class="tab-content active">
      <div class="card">
        <div class="card-title">🚨 Phase 1 Tasks — Complete Today</div>
        <div id="task-list">
          <!-- Tasks loaded by JS -->
        </div>
        
        <div style="margin-top: 2rem;">
          <div>Your Progress: <span id="progress-text">0/6</span></div>
          <div class="progress-bar" style="margin-top: 0.5rem;">
            <div class="progress-fill" id="progress-bar" style="width: 0%;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Screenshots -->
    <div id="screenshots" class="tab-content">
      <div class="card">
        <div class="card-title">📸 Visual Progress Log (${getScreenshots().length} screenshots)</div>
        <div class="screenshot-grid">
          ${generateScreenshotGallery()}
        </div>
      </div>
    </div>

    <!-- Conversations -->
    <div id="conversations" class="tab-content">
      <div class="card">
        <div class="card-title">💬 Complete Conversation History</div>
        <div class="doc-content">
          ${mdToHtml(readFile('content/FULL_CONVERSATION_LOG.md'))}
        </div>
      </div>
    </div>

    <!-- Documents -->
    <div id="docs" class="tab-content">
      <div style="display: grid; grid-template-columns: 300px 1fr; gap: 2rem;">
        <div class="card">
          <div class="card-title">📁 All Documents</div>
          <ul class="file-tree" id="doc-list">
            <!-- Loaded by JS -->
          </ul>
        </div>
        
        <div class="card">
          <div class="card-title" id="doc-title">Select a document</div>
          <div class="doc-content" id="doc-viewer">
            <p style="color: var(--text-muted);">Click a document to view its content.</p>
          </div>
        </div>
      </div>
    </div>
  </main>

  <script>
    // Task data
    const tasks = [
      { id: 'domains', title: 'Register 3 Domains', desc: 'aldoesai.com, .net, .org at Cloudflare', time: '10 min', cost: '$28', link: 'https://dash.cloudflare.com' },
      { id: 'twitter', title: 'Secure Twitter @AlDoesAI', desc: 'Create account and claim handle', time: '5 min', link: 'https://twitter.com' },
      { id: 'instagram', title: 'Secure Instagram @aldoesai', desc: 'Via mobile app', time: '5 min', link: null },
      { id: 'tiktok', title: 'Secure TikTok @aldoesai', desc: 'Via mobile app', time: '5 min', link: null },
      { id: 'youtube', title: 'Create YouTube Channel', desc: '"Al Does AI" with @AlDoesAI handle', time: '10 min', link: 'https://youtube.com' },
      { id: 'linkedin', title: 'Create LinkedIn Page', desc: 'For B2B presence', time: '10 min', link: 'https://linkedin.com' }
    ];

    // Load tasks
    function renderTasks() {
      const container = document.getElementById('task-list');
      container.innerHTML = tasks.map(t => {
        const isDone = localStorage.getItem('task_' + t.id) === 'true';
        return \`
          \u003cdiv class="task-item \${isDone ? 'completed' : ''}" data-task="\${t.id}">
            \u003cdiv class="task-checkbox \${isDone ? 'checked' : ''}" onclick="toggleTask('\${t.id}')">\u003c/div>
            \u003cdiv>
              \u003cdiv style="font-weight: 600;">\${t.title}\u003c/div>
              \u003cdiv style="color: var(--text-muted); font-size: 0.9rem;">\${t.desc}\u003c/div>
              \u003cdiv style="margin-top: 0.5rem; font-size: 0.85rem;">
                \u003cspan style="background: rgba(245, 158, 11, 0.2); color: var(--accent); padding: 0.25rem 0.5rem; border-radius: 4px; margin-right: 0.5rem;">⏱️ \${t.time}\u003c/span>
                \${t.cost ? \`\u003cspan style="color: var(--accent);"\u003e\${t.cost}\u003c/span>\` : ''}
                \${t.link ? \`\u003ca href="\${t.link}" target="_blank" style="color: var(--secondary);"\u003eOpen →\u003c/a>\` : ''}
              \u003c/div>
            \u003c/div>
          \u003c/div>
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

    // Tab navigation
    function showTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      event.target.classList.add('active');
    }

    // Document viewer
    const docs = [
      { name: 'PROJECT_CHARTER.md', path: '../docs/PROJECT_CHARTER.md' },
      { name: 'COMPREHENSIVE_DIGITAL_REAL_ESTATE.md', path: '../docs/COMPREHENSIVE_DIGITAL_REAL_ESTATE.md' },
      { name: 'ACTION_REQUIRED.md', path: '../ACTION_REQUIRED.md' },
      { name: 'DAY_01.md', path: '../content/DAY_01.md' },
      { name: 'FULL_CONVERSATION_LOG.md', path: '../content/FULL_CONVERSATION_LOG.md' }
    ];

    function renderDocList() {
      const list = document.getElementById('doc-list');
      list.innerHTML = docs.map(d => \`
        \u003cli class="file-item" onclick="loadDoc('\${d.path}', '\${d.name}')">
          \u003cspan class="file-icon" style="background: var(--primary);">MD\u003c/span>
          \u003cspan>\${d.name}\u003c/span>
        \u003c/li>
      \`).join('');
    }

    function loadDoc(path, name) {
      document.getElementById('doc-title').textContent = name;
      // For file:// protocol, we'll show a message since we can't fetch
      // In production with a server, this would fetch and render
      document.getElementById('doc-viewer').innerHTML = 
        \`\u003cp\u003e\u003cstrong\u003e\${name}\u003c/strong\u003e\u003c/p\u003e\` +
        \`\u003cp style="color: var(--text-muted);"\u003e\u003ci\u003eContent embedded in HTML file. View source to read, or open directly:\u003c/i\u003e\u003c/p\u003e\` +
        \`\u003cp\u003e\u003ccode\u003eopen "\${path.replace('../', '')}"\u003c/code\u003e\u003c/p\u003e\`;
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      renderTasks();
      renderDocList();
    });
  </script>
</body>
</html>
`;

// Write the file
fs.writeFileSync(OUTPUT_FILE, html);
console.log('✅ Dashboard rebuilt successfully!');
console.log(`   Output: ${OUTPUT_FILE}`);
console.log(`   Screenshots: ${getScreenshots().length}`);
console.log(`   Documents: ${getDocuments().length}`);
console.log(`   Size: ${(html.length / 1024).toFixed(1)} KB`);
