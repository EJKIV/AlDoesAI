# TASK BRIEF: Dashboard V5 — Complete Rebuild

**Task ID:** dashboard-v5-rebuild  
**Agent:** Build Division  
**Priority:** HIGH  
**Status:** APPROVED BY JIM

---

## OBJECTIVE

Rebuild dashboard with:
1. Fixed screenshot rendering (space encoding)
2. New "🎯 Today" tab as default (split Jim/Al daily tasks)
3. New "📅 30-Day Plan" tab with Days 1-30 detail
4. New "🔄 Machine" tab (agents, research, content flow)
5. Pre-render all new documents as inline HTML

---

## CRITICAL FIX: SCREENSHOT PATHS

**Problem:** Filenames with spaces don't render  
**Solution:** Encode spaces as `%20`

**Current filenames:**
```
"Screenshot 2026-03-05 at 8.56.18 AM.png"
"Screenshot 2026-03-05 at 11.37.49 AM.png"
```

**Required encoding:**
```
"Screenshot%202026-03-05%20at%208.56.18%20AM.png"
"Screenshot%202026-03-05%20at%2011.37.49%20AM.png"
```

**Implementation:** Use `encodeURIComponent(filename)` in build script.

---

## NEW DASHBOARD STRUCTURE

### Tab Order (Left to Right)

1. **🎯 Today** — DEFAULT active tab
2. **📅 30-Day Plan**
3. **🔄 Machine**
4. **💰 Budget**
5. **📸 Screenshots**
6. **💬 Conversations**
7. **📄 Documents**

---

## TAB 1: 🎯 TODAY (Default)

**Layout:** Three-column split or stacked cards

### Card 1: Today's Overview
```
🎯 TODAY — Thursday, March 5, 2026 (Day 1)
Phase: Ignition | Week 1: Foundation
```

### Card 2: Jim's Tasks

| Status | Task | Time | Output |
|--------|------|------|--------|
| ☐ | Buy aldoesai.com | 10 min | Domain secured |
| ☐ | Register Twitter @AlDoesAI | 5 min | Handle claimed |
| ☐ | Register Instagram @aldoesai | 5 min | Handle claimed |
| ☐ | Register TikTok @aldoesai | 5 min | Handle claimed |
| ☐ | Create YouTube channel | 10 min | Channel live |
| ☐ | Create LinkedIn page | 10 min | Page published |
| ☐ | Create GitHub org 'aldoesai' | 10 min | Org created |
| ☐ | Add screenshots to ~/Documents/AlDoesAI/ | ongoing | Visual log |

**Progress:** X/8 tasks

### Card 3: Al's Tasks

| Status | Task | Time | Output |
|--------|------|------|--------|
| ✅ | Build dashboard v4 | 2 hrs | Dashboard live |
| ☐ | Fix screenshot encoding | 30 min | Images render |
| ☐ | Build dashboard v5 | 3 hrs | New structure |
| ☐ | Create 30-day plan docs | 1 hr | Plan published |
| ☐ | Create agent roster | 30 min | Team defined |
| ☐ | Create research topics | 30 min | Topics queued |
| ☐ | Create content calendar | 30 min | Calendar linked |

**Progress:** X/7 tasks

### Card 4: Content Today

**Status:** Waiting for Jim's Day 1 thoughts

**Planned:**
- 📱 Twitter: "Day 1: $0 Setup" thread
- 💼 LinkedIn: Vision post
- 🎬 TikTok: Behind-the-scenes
- 📧 Substack: Week 1 preview (draft)

---

## TAB 2: 📅 30-DAY PLAN

**Source:** `docs/30_DAY_PLAN.md`  
**Format:** Week-by-week accordion or tabs

### Week 1: Foundation (Days 1-7)
- Day 1: Launch + Digital real estate
- Day 2: Social verification
- Day 3: Content templates
- Day 4: Research system
- Day 5: Analytics + metrics
- Day 6: Community setup  
- Day 7: Week 1 review

### Week 2: Content Engine (Days 8-14)
- Daily content rhythm
- Template library in use
- Research queue active

### Week 3: Agent Deploy (Days 15-21)
- Day 15: TrendTracker
- Day 16: ContentCreator
- Day 17: Distributor
- Day 18: Analytics

### Week 4: Scale + Measure (Days 22-30)
- Double down on working content
- Cut what doesn't perform
- Plan Month 2

**Each day shows:** Jim tasks | Al tasks | Content output

---

## TAB 3: 🔄 MACHINE

**Visual:** Simple flow diagram or three-column layout

### Section 1: Agent Team Roster

| Agent | Status | Owner | Schedule | Output |
|-------|--------|-------|----------|--------|
| 🕸️ Webby | ✅ Live | Al | Daily 6 AM | Site updated |
| 🔍 TrendTracker | ⏳ Day 15 | Al | Daily 6 AM | Research digest |
| ✍️ ContentCreator | ⏳ Day 16 | Al | Daily 7 AM | 3 drafts/day |
| 📤 Distributor | ⏳ Day 17 | Al | Multi | Cross-post |
| 📊 Analytics | ⏳ Day 18 | Al | Daily 6 PM | Reports |

### Section 2: Research Queue

**Active Topics:**
1. Claude 3.5 capabilities
2. OpenClaw subagent patterns
3. r/LocalLLaMA trends
4. HN AI discussions
5. Twitter AI sentiment

**Sources:** 8 daily scans

### Section 3: Content Flow

**Input → Processing → Output**

1. **Input:** Trends, prompts, community
2. **Processing:** Agents create drafts
3. **Output:** Twitter, LinkedIn, Substack, YouTube, TikTok
4. **Feedback:** Metrics loop back to input

---

## TAB 4-7: Existing (Keep Current)

- 💰 Budget — Keep current implementation
- 📸 Screenshots — Fix paths, keep grid
- 💬 Conversations — Keep current
- 📄 Documents — Keep tabs with all docs

---

## FILES TO READ/CONVERT

### New Documents (Convert to HTML)
1. `docs/30_DAY_PLAN.md` → 30-Day Plan content
2. `docs/CONTENT_CALENDAR.md` → Calendar details
3. `docs/AGENT_TEAM_ROSTER.md` → Agent table
4. `docs/RESEARCH_TOPICS.md` → Research section
5. `content/DAY_01_DRAFT_FRAMEWORK.md` → Content Today placeholder

### Existing (Keep)
- `content/FULL_CONVERSATION_LOG.md`
- `docs/PROJECT_CHARTER.md`
- `docs/INVESTMENT_LEDGER.md`
- All other docs in docs/

---

## TECHNICAL REQUIREMENTS

### Build Script Updates
```javascript
// Fix screenshot encoding
const screenshotHTML = screenshots.map(s => `
  <div class="screenshot-item">
    <img src="assets/screenshots/${encodeURIComponent(s.file)}" 
         alt="${s.file}" loading="lazy">
    <div class="screenshot-meta">${s.file}</div>
  </div>
`).join('');
```

### CSS Requirements
- Split-view layout for Today tab
- Week accordion for 30-Day Plan
- Flow diagram or three-column for Machine
- Consistent dark theme

### Output
- Single file: `dashboard/index.html`
- Size estimate: ~150 KB
- All content embedded (no external fetches)

---

## SUCCESS CRITERIA

- [ ] All 14 screenshots display correctly
- [ ] 🎯 Today tab shows by default
- [ ] Jim/Al tasks split clearly visible
- [ ] 30-Day Plan has Day 1-30 detail
- [ ] Machine tab shows agents/research/flow
- [ ] Today shows "Day 1" with current tasks
- [ ] Git commit with descriptive message

---

## REPORT BACK

Send:
1. Screenshot count confirming all display
2. Tab order confirmation
3. File size of final HTML
4. Git commit hash

---

**Approved by:** Jim (2026-03-05 13:41 EST)  
**ON THE RECORD:** Yes
