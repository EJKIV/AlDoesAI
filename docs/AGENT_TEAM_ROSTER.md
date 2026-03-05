# Agent Team Roster — Al Does AI

**The machine that builds the content.**

---

## Active Agents

### 🕸️ Webby — Webmaster Agent
**Status:** ✅ **DEPLOYED** (March 5, 2026)

| Property | Value |
|----------|-------|
| Owner | Al |
| Emoji | 🕸️ |
| Role | Site maintenance, dashboard updates |
| Schedule | Daily 6:00 AM EST |
| Tasks | Screenshot sync, dashboard rebuild, git commits |
| Output | Current dashboard |
| Documentation | `.agents/webby/` |

**Health:** ✅ Operational  
**Last Run:** Today, 12:47 PM  
**Next Action:** Continue daily maintenance

---

## Planned Agents (Deployment Queue)

### 🔍 TrendTracker — Research Agent
**Status:** ⏳ **QUEUED** (Deploy: Day 15)

| Property | Value |
|----------|-------|
| Owner | Al |
| Emoji | 🔍 |
| Role | Morning research digest |
| Schedule | Daily 6:00 AM EST (before Webby) |

**Responsibilities:**
- Scan 5+ sources (OpenClaw, Anthropic, OpenAI, r/LocalLLaMA, HN)
- Identify 3 trending topics worth noting
- Suggest 1 content opportunity for today
- Compile into morning digest

**Outputs:**
- Daily research report (markdown)
- Trending topics queue
- Content opportunity alert

**Deploy Criteria:**
- [ ] Week 2 content baseline established
- [ ] Research sources defined
- [ ] Digest template approved by Jim

---

### ✍️ ContentCreator — Draft Generation Agent
**Status:** ⏳ **QUEUED** (Deploy: Day 16)

| Property | Value |
|----------|-------|
| Owner | Al |
| Emoji | ✍️ |
| Role | Generate content drafts from templates |
| Schedule | Daily 7:00 AM EST (after TrendTracker) |

**Responsibilities:**
- Pull from CONTENT_TEMPLATES.md
- Match template to trend/topic
- Generate 3 daily post drafts
- Queue for Jim approval

**Outputs:**
- 3 draft posts per day
- Linked to templates
- With suggested hashtags
- Ready for review

**Deploy Criteria:**
- [ ] Template library complete
- [ ] Voice/tone guidelines documented
- [ ] Approval workflow defined

---

### 📤 Distributor — Cross-Platform Posting Agent
**Status:** ⏳ **QUEUED** (Deploy: Day 17)

| Property | Value |
|----------|-------|
| Owner | Al |
| Emoji | 📤 |
| Role | Schedule and post content across platforms |
| Schedule | Per content calendar (multiple times/day) |

**Responsibilities:**
- Queue approved content
- Format per platform
- Schedule optimal times
- Track post status

**Outputs:**
- Twitter/X posts
- LinkedIn posts
- TikTok uploads
- YouTube scheduling

**Deploy Criteria:**
- [ ] Platform APIs accessible
- [ ] Scheduling rules defined
- [ ] Jim approves auto-post for Tier 1 content

---

### 📊 Analytics — Metrics Tracking Agent
**Status:** ⏳ **QUEUED** (Deploy: Day 18)

| Property | Value |
|----------|-------|
| Owner | Al |
| Emoji | 📊 |
| Role | Track and report performance metrics |
| Schedule | Daily 6 PM EST (end-of-day), Weekly Sundays |

**Responsibilities:**
- Collect metrics from all platforms
- Calculate engagement rates
- Identify top-performing content
- Generate daily + weekly reports

**Outputs:**
- Daily metrics dashboard
- Weekly performance report
- Trend analysis
- Recommendations

**Deploy Criteria:**
- [ ] Analytics accounts set up
- [ ] KPIs defined with Jim
- [ ] Report format approved

---

### 🎬 VideoEditor — Content Production Agent
**Status:** ⏳ **BACKLOG** (Deploy: Month 2)

| Property | Value |
|----------|-------|
| Owner | Al |
| Emoji | 🎬 |
| Role | Produce short-form video content |
| Schedule | As needed (3x/week initially) |

**Responsibilities:**
- Edit screen recordings
- Add captions/graphics
- Generate TikTok/YouTube Shorts
- Sync with ContentCreator

**Deploy Criteria:**
- [ ] Video editing library/integration
- [ ] Style guidelines set
- [ ] Workflow with Jim approved

---

## Deployment Timeline

| Week | Day | Agent | Action |
|------|-----|-------|--------|
| W1 | 5 | Webby | ✅ DEPLOYED |
| W3 | 15 | TrendTracker | Deploy spec → run |
| W3 | 16 | ContentCreator | Deploy spec → run |
| W3 | 17 | Distributor | Deploy spec → run |
| W3 | 18 | Analytics | Deploy spec → run |
| W4 | 19 | — | Integration testing |
| W4 | 20 | — | Tuning based on data |
| W4 | 21 | All | Review + iterate |
| M2 | 22+ | VideoEditor | Spec → prototype |

---

## Agent Communication Protocol

### Daily Handoff Chain

```
06:00 — TrendTracker delivers digest
06:05 — Webby updates dashboard (includes digest)
07:00 — ContentCreator generates drafts
07:30 — Jim reviews drafts
08:00 — Distributor schedules approved content
18:00 — Analytics collects daily data
18:05 — Webby updates with metrics
```

### Inter-Agent Messages

**Standard format:**
```
FROM: AgentName
TO: AgentName
TASK: What to do
DATA: {structured data}
DEADLINE: When
PRIORITY: High/Med/Low
```

**Example:**
```
FROM: TrendTracker
TO: ContentCreator
TASK: Generate thread on trending topic
DATA: { topic: "Claude 3.5", angle: "comparison", template: "vs" }
DEADLINE: 07:00
PRIORITY: High
```

---

## Human Oversight

### Jim's Role
- **Approve** all agent-generated content before publish
- **Review** daily digests and weekly reports
- **Intervene** when agent output off-brand
- **Iterate** on agent specs based on results

### Al's Role
- **Build** agent specs and deploy
- **Monitor** agent health and performance
- **Debug** when agents fail or produce poor output
- **Scale** agent team based on workload

---

## Success Metrics (Per Agent)

| Agent | Primary Metric | Target |
|-------|---------------|--------|
| Webby | Uptime | 99% |
| TrendTracker | Relevant trends caught | 5/day |
| ContentCreator | Drafts accepted | 80% |
| Distributor | On-time posts | 95% |
| Analytics | Report accuracy | 100% |

---

**Last Updated:** March 5, 2026  
**Next Review:** Weekly (Sundays)  
**Owner:** Al (builds), Jim (approves)
