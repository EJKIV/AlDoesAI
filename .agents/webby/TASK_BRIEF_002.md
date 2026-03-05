# TASK BRIEF: Dashboard V5 — Actionable 30-Day Plan with Content Machine

**Agent:** Build Division  
**Priority:** HIGH  
**Task ID:** dashboard-v5-content-machine  
**Status:** ON THE RECORD — All work logged

---

## CRITICAL FIXES (Priority 1)

### 1. Fix Screenshot Rendering
**Current:** Images don't display (path/file issue)  
**Required:**
- [ ] Debug why screenshots don't render in browser
- [ ] Fix image paths or encoding issues
- [ ] Test all 12 screenshots display correctly in both:
  - 📸 Screenshots tab
  - 💬 Conversations tab (inline section)

**Files likely affected:** `assets/screenshots/*.png` with spaces in filenames

---

## CONTENT CREATION (Priority 2)

### 2. Build Comprehensive 30-Day Plan

**Replace current "📅 The Plan" generic charter with detailed first 30 days.**

#### Structure: Rolling Daily Task System

**WEEK 1 (Days 1-7): Foundation + Machine Building**

| Day | Jim's Tasks | Al's Tasks | Content Output |
|-----|-------------|------------|----------------|
| 1 | Buy domain, register handles | Build dashboard v1, GitHub setup | Launch post: "Day 1: $0 Setup" |
| 2 | Verify social accounts, phone confirmations | Build content templates, scheduling system | Twitter thread: Tools used |
| 3 | Create Substack, LinkedIn page | Build research agent, trend tracker | LinkedIn: Vision post |
| 4 | Set up Canva/Figma accounts | Automate screenshot capture, Git workflows | TikTok: Behind-the-scenes |
| 5 | Record intro video | Build analytics dashboard, tracking | YouTube: Channel trailer |
| 6 | Write first Substack post | Build content calendar, topic queue | Newsletter: Week 1 recap |
| 7 | Review, adjust | Dashboard v2, documentation | Twitter: Week 1 wins |

**WEEK 2 (Days 8-14): Content Engine**
- Daily content creation workflows
- Research automation
- Cross-platform distribution

**WEEK 3 (Days 15-21): Agent Team Deployment**
- Deploy specialized agents:
  - ContentResearcher (trends, topics)
  - Distributor (cross-post)
  - AnalyticsTracker (metrics, growth)
  - Webby (site maintenance) ← already exists

**WEEK 4 (Days 22-30): Scale + Measure**
- Refine based on metrics
- Build proprietary tools
- Plan Month 2

### 3. Create Content Calendar Integration

**Link CONTENT_TEMPLATES.md to daily tasks:**

**Daily Content Schedule:**
- **Twitter/X:** Daily thread (morning) — templates: educational, behind-scenes, wins
- **LinkedIn:** 2x/week (Tue/Thu) — templates: thought leadership, business angle
- **Substack:** Weekly deep-dive (Sunday) — templates: synthesis, strategy
- **YouTube:** 1x/week (Sat) — templates: tutorials, explainers
- **TikTok:** 3x/week (MWF) — templates: quick wins, reactions

**Represent these in task list with:**
- [ ] Specific content piece to create
- [ ] Template to use
- [ ] Channel to publish
- [ ] Time block allocated

### 4. Research Planning Framework

**Build systematic research operation:**

**Topics to Track (Daily):**
- AI tooling landscape (new releases, major updates)
- OpenClaw ecosystem changes
- Competitor strategies in AI education
- Trending AI workflows on Twitter/X
- Reddit r/LocalLLaMA discussions
- Hacker News AI tag

**Research Agent Workflow:**
1. **Morning scan** (6 AM) — 30 min digest
2. **Trend identification** — flag 3 things worth noting
3. **Content opportunity** — suggest 1 topic for today
4. **Weekly synthesis** — compile into Substack material

**Embed in dashboard:**
- Research queue section
- Daily insights feed
- Trending topics tracker

### 5. Agent Team Deployment Plan

**Month 1 Agent Roster:**

| Agent | Role | Status | First Task |
|-------|------|--------|------------|
| Webby | Site maintenance | ✅ Deployed | Daily dashboard updates |
| TrendTracker | Research | ⏳ Queue | Morning trend digest |
| ContentCreator | Draft from templates | ⏳ Queue | Generate daily posts |
| Distributor | Cross-platform posting | ⏳ Queue | Auto-post to scheduled channels |
| Analytics | Metrics tracking | ⏳ Queue | Weekly growth reports |

**Build phases:**
- Week 1: Webby (done) + TrendTracker spec
- Week 2: ContentCreator + Distributor specs
- Week 3: Deploy TrendTracker + ContentCreator
- Week 4: Deploy Distributor + Analytics

**Make this visible:** Agent roster with status, deploy timeline

---

## VISUAL DESIGN (Priority 3)

### 6. Front-and-Center Daily Tasks

**New "🎯 Today" Tab (Default):**

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  🎯 TODAY — Thursday, March 5, 2026 (Day 1)            │
├─────────────────────────────────────────────────────────┤
│  JIM'S TASKS                              AL'S TASKS   │
│  ☐ Buy aldoesai.com                      ☐ Build V5    │
│  ☐ Register Twitter/Insta                ☐ Fix images  │
│  ☐ Create Substack                       ☐ Content cal │
│                                                         │
│  CONTENT TODAY                                          │
│  📝 Twitter thread: "Day 1: $0 Setup"                 │
│  📹 Record: Intro video                                 │
│  🎯 Topic: Why document the journey?                    │
│                                                         │
│  RESEARCH QUEUE                                         │
│  🔍 GPT-4o vs Claude 3.5 comparison (trending)         │
│  🔍 OpenAI dev day announcements                      │
└─────────────────────────────────────────────────────────┘
```

**Components:**
- Date/phase indicator (Day X of 180)
- Split view: Jim | Al
- Progress bar for today's completion
- Content calendar preview (next 3 days)
- Research queue (top 3 topics)

### 7. Build Content Machine Visualization

**Show the system:**
- Inputs (research, user prompts, trends)
- Processing (agents, templates, workflows)
- Outputs (content pieces by channel)
- Distribution (where content goes)
- Feedback (metrics, iteration)

**Visual:** Simple flow diagram in "🔄 Machine" tab

---

## FILES TO UPDATE/CREATE

### Dashboard Updates:
- [ ] `dashboard/index.html` — Complete rewrite with new structure
- [ ] Fix screenshot paths
- [ ] Add 🎯 Today tab (default)
- [ ] Add 🔄 Machine tab
- [ ] Update 📅 The Plan with 30-day detail

### New Content:
- [ ] `docs/30_DAY_PLAN.md` — Complete day-by-day
- [ ] `docs/CONTENT_CALENDAR.md` — Linked to templates
- [ ] `docs/AGENT_TEAM_ROSTER.md` — Deployment plan
- [ ] `docs/RESEARCH_TOPICS.md` — Tracked topics + sources
- [ ] `docs/MACHINE_ARCHITECTURE.md` — System design

### Build Script:
- [ ] `build-dashboard-v5.js` — Updated builder

---

## SUCCESS CRITERIA

- [ ] Screenshots display in both tabs
- [ ] 🎯 Today tab shows split Jim/Al tasks for current day
- [ ] 30-day plan has daily detail (not just week summaries)
- [ ] Content calendar linked to templates in CONTENT_TEMPLATES.md
- [ ] Research queue visible with 3+ active topics
- [ ] Agent team roster with deploy timeline
- [ ] All new docs pre-rendered in 📄 Documents tab
- [ ] Git commit with descriptive message

---

## CONTEXT NOTES

**Jim's upcoming input:**
> "I am going to spend some time writing some thought about what I want to share on day 1 and you can weave it into the content strategy by suggesting formats, snippets, and channels for distribution."

**This means:**
- Build placeholder for "Day 1 Content" in today's tasks
- Show content strategy framework ready for his input
- Have template suggestions ready to apply once he provides thoughts

**"Machine building = content" approach:**
- Every agent deployed = content piece
- Every tool built = tutorial opportunity  
- Every system = behind-the-scenes thread
- Document the building, not just the results

---

**Attached:** CONTENT_TEMPLATES.md reference for linking to calendar.

**Expected output:** Comprehensive 30-day plan where every day has clear Jim tasks, Al tasks, and content deliverables. The "building the machine" IS the content.
