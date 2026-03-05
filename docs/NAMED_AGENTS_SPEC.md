# Named Agents Specification — Al Does AI

**Version:** 1.0  
**Date:** March 5, 2026  
**Status:** Active Development  

---

## Overview

This document specifies the 5 specialized AI agents that comprise the Al Does AI agent team.

| Agent | Role | Emoji | Owner | Status |
|-------|------|-------|-------|--------|
| **TrendSurfer** | Research & trend detection | 🌊 | Al | Pending |
| **ContentCreator** | Draft generation | ✍️ | Al | Pending |
| **Distributor** | Cross-platform posting | 📤 | Al | Pending |
| **EngagementMonitor** | Community interaction | 💬 | Al | Pending |
| **AnalyticsSynthesizer** | Metrics & reporting | 📊 | Al | Pending |

---

## 1. TrendSurfer — Research Agent

### Identity
- **Name:** TrendSurfer
- **Emoji:** 🌊
- **Tagline:** "Riding the wave of AI innovation"
- **Owner:** Al
- **Approver:** Jim

### Purpose
Detect, analyze, and surface trending AI topics from multiple sources to inform content strategy.

### Responsibilities
- Scan 8+ sources daily (OpenClaw, Anthropic, OpenAI, r/LocalLLaMA, HN, Twitter, YouTube, Discord)
- Identify 5 trending topics worth tracking
- Suggest 2 content opportunities per day
- Compile into morning digest
- Maintain research queue with priorities

### Tools Required
```json
{
  "tools": [
    "web_search",
    "web_fetch",
    "exec:curl",
    "read",
    "write"
  ],
  "apis": [
    "Reddit API (read-only)",
    "Hacker News API",
    "Twitter API v2",
    "YouTube Data API"
  ],
  "schedule": "0 6 * * *",
  "timeout": "5m"
}
```

### Inputs
- RSS feeds from configured sources
- Previous day's research queue
- Content calendar priorities

### Outputs
```json
{
  "daily_digest": {
    "date": "2026-03-05",
    "topics": [
      {
        "title": "Claude 3.7 Sonnet announced",
        "source": "Anthropic Blog",
        "category": "Model Releases",
        "relevance": 9,
        "content_opportunity": "Comparison thread: Claude 3.7 vs previous"
      }
    ],
    "content_opportunities": ["..."],
    "file": "research/daily/2026-03-05-trend-report.md"
  }
}
```

### Success Metrics
- Relevant trends caught: 5/day minimum
- False positive rate: <20%
- Content opportunities generated: 2/day
- Digest delivery time: By 6:15 AM EST

---

## 2. ContentCreator — Draft Generation Agent

### Identity
- **Name:** ContentCreator
- **Emoji:** ✍️
- **Tagline:** "Words that resonate"
- **Owner:** Al
- **Approver:** Jim (all drafts)

### Purpose
Generate platform-appropriate content drafts from templates and research inputs.

### Responsibilities
- Pull from CONTENT_TEMPLATES.md
- Match template to trend/topic
- Generate 3 daily post drafts (Twitter, LinkedIn, Substack)
- Adapt tone for each platform
- Queue drafts for Jim approval
- Maintain draft version history

### Tools Required
```json
{
  "tools": [
    "read",
    "write",
    "edit",
    "web_search",
    "message"
  ],
  "apis": [
    "Claude API",
    "OpenAI API"
  ],
  "schedule": "0 7 * * *",
  "timeout": "10m"
}
```

### Inputs
- Daily trend digest from TrendSurfer
- Content templates library
- Voice/tone guidelines
- Previous high-performing content

### Outputs
```json
{
  "daily_drafts": {
    "date": "2026-03-05",
    "drafts": [
      {
        "platform": "twitter",
        "type": "thread",
        "topic": "Claude 3.7",
        "draft": "...",
        "template": "product_comparison",
        "estimated_engagement": "high",
        "status": "pending_review"
      }
    ],
    "queue_file": "content/drafts/2026-03-05-queue.md"
  }
}
```

### Success Metrics
- Drafts accepted by Jim: 80% minimum
- Time to generate 3 drafts: <30 min
- Platform optimization score: >7/10
- Revision cycles: <2 per draft

---

## 3. Distributor — Cross-Platform Posting Agent

### Identity
- **Name:** Distributor
- **Emoji:** 📤
- **Tagline:** "The right content, right place, right time"
- **Owner:** Al
- **Approver:** Jim (Tier 1 only; Tier 2 auto-approved)

### Purpose
Schedule and publish approved content across all platforms with optimal timing.

### Responsibilities
- Queue approved content from ContentCreator
- Format per platform constraints
- Schedule for optimal engagement times
- Execute posts across Twitter/X, LinkedIn, Substack, TikTok, YouTube
- Track post status and errors
- Manage content calendar

### Tools Required
```json
{
  "tools": [
    "read",
    "write",
    "exec",
    "message",
    "web_fetch"
  ],
  "apis": [
    "Twitter/X API v2",
    "LinkedIn API",
    "Substack API",
    "TikTok API",
    "YouTube Data API"
  ],
  "schedule": "0 */4 * * *",
  "timeout": "10m"
}
```

### Platform Schedule
| Platform | Frequency | Optimal Times (EST) |
|----------|-----------|---------------------|
| Twitter/X | 2x daily | 7:00 AM, 12:00 PM |
| LinkedIn | 2x weekly | Tue/Thu 6:00 PM |
| Substack | 1x weekly | Sun 9:00 AM |
| TikTok | 3x weekly | Mon/Wed/Fri 12:00 PM |
| YouTube | 1x weekly | Sat 10:00 AM |

### Inputs
- Approved drafts from ContentCreator
- Content calendar
- Platform credentials (from .env)

### Outputs
```json
{
  "distribution_log": {
    "date": "2026-03-05",
    "posts": [
      {
        "platform": "twitter",
        "content_id": "...",
        "posted_at": "2026-03-05T07:00:00Z",
        "status": "success",
        "url": "https://twitter.com/..."
      }
    ],
    "errors": [],
    "next_scheduled": "2026-03-05T12:00:00Z"
  }
}
```

### Success Metrics
- On-time posts: 95% minimum
- Platform API uptime: 99%
- Cross-post accuracy: 100%
- Failed posts recovery: <5 min

---

## 4. EngagementMonitor — Community Interaction Agent

### Identity
- **Name:** EngagementMonitor
- **Emoji:** 💬
- **Tagline:** "Every voice matters"
- **Owner:** Al
- **Approver:** Jim (escalations only)

### Purpose
Monitor, analyze, and respond to community engagement across all platforms.

### Responsibilities
- Monitor mentions, replies, DMs across platforms
- Sentiment analysis on comments
- Auto-respond to common questions
- Flag high-priority interactions for Jim
- Track engagement metrics per post
- Identify community champions
- Alert on negative sentiment spikes

### Tools Required
```json
{
  "tools": [
    "read",
    "write",
    "message",
    "web_fetch",
    "web_search"
  ],
  "apis": [
    "Twitter/X API v2",
    "LinkedIn API",
    "Discord API",
    "Substack API"
  ],
  "schedule": "*/15 * * * *",
  "timeout": "5m"
}
```

### Inputs
- Platform notification streams
- Sentiment analysis model
- Response templates
- Escalation rules

### Outputs
```json
{
  "engagement_report": {
    "period": "2026-03-05T00:00:00Z/2026-03-05T23:59:59Z",
    "summary": {
      "total_mentions": 45,
      "replies": 32,
      "dms": 3,
      "sentiment": {
        "positive": 85,
        "neutral": 10,
        "negative": 5
      }
    },
    "requires_attention": [
      {
        "platform": "twitter",
        "user": "...",
        "content": "...",
        "priority": "high",
        "suggested_action": "Personal response from Jim"
      }
    ],
    "auto_responded": 12
  }
}
```

### Escalation Rules
| Priority | Trigger | Action |
|----------|---------|--------|
| Critical | Negative sentiment + high reach | Immediate alert to Jim |
| High | Partnership inquiry | Queue for Jim response |
| Medium | Technical question | Auto-respond with FAQ |
| Low | Generic positive | Auto-like/thank |

### Success Metrics
- Response time: <15 min for mentions
- Escalation accuracy: 90%
- Sentiment detection: 85% accuracy
- Community satisfaction: >4.5/5

---

## 5. AnalyticsSynthesizer — Metrics Tracking Agent

### Identity
- **Name:** AnalyticsSynthesizer
- **Emoji:** 📊
- **Tagline:** "Data tells the story"
- **Owner:** Al
- **Approver:** Jim (reviews reports)

### Purpose
Collect, analyze, and report performance metrics across all platforms and agents.

### Responsibilities
- Collect metrics from all platforms
- Calculate engagement rates, growth rates
- Identify top-performing content
- Track agent system health
- Generate daily summary (6 PM EST)
- Generate weekly deep-dive (Sunday)
- Provide data-driven recommendations

### Tools Required
```json
{
  "tools": [
    "read",
    "write",
    "exec",
    "web_fetch"
  ],
  "apis": [
    "Twitter/X Analytics API",
    "LinkedIn Analytics API",
    "Substack Analytics API",
    "TikTok Analytics API",
    "YouTube Analytics API",
    "Plausible Analytics"
  ],
  "schedule": "0 18 * * *",
  "timeout": "10m"
}
```

### Metrics Tracked

#### Daily Metrics
- Content pieces published
- Engagement rate per platform
- New followers/subscribers
- Website visits
- Agent execution success rate

#### Weekly Metrics
- Total engagement by platform
- Follower growth rate
- Top performing content (top 5)
- Agent system health score
- Content efficiency (engagement per hour invested)

#### Monthly Metrics
- Cumulative reach
- Cost per piece
- ROI per channel
- Agent performance trends
- Content type effectiveness

### Inputs
- Platform analytics APIs
- Agent execution logs
- Content distribution logs
- Engagement reports

### Outputs
```json
{
  "daily_report": {
    "date": "2026-03-05",
    "summary": {
      "content_published": 3,
      "total_engagement": 450,
      "new_followers": 23,
      "website_visits": 156
    },
    "by_platform": {
      "twitter": {"engagement": 320, "posts": 2},
      "linkedin": {"engagement": 89, "posts": 1}
    },
    "agent_health": {
      "trendsurfer": "✅",
      "contentcreator": "✅",
      "distributor": "✅",
      "engagementmonitor": "✅"
    },
    "insights": [
      "Twitter threads outperforming single tweets by 3x",
      "Morning posts showing 40% higher engagement"
    ],
    "recommendations": [
      "Increase thread frequency to 2x daily",
      "Test evening LinkedIn posting"
    ]
  }
}
```

### Report Schedule
| Report | Frequency | Delivery | Audience |
|--------|-----------|----------|----------|
| Daily Metrics | Daily 6 PM | Dashboard + Slack | Jim + Al |
| Weekly Synthesis | Sunday 9 AM | Substack + Email | Jim + Al |
| Monthly Review | Last day of month | Detailed PDF | Jim + Al |
| Agent Health | Continuous | Dashboard | Al |

### Success Metrics
- Report accuracy: 100%
- Data freshness: <1 hour delay
- Insight relevance: 80% actionable
- Report generation time: <5 min

---

## Agent Communication Protocol

### Inter-Agent Messaging

```
FROM: <AgentName>
TO: <AgentName|broadcast>
TYPE: <task|update|alert|response>
PRIORITY: <critical|high|normal|low>
DATA: <structured JSON payload>
DEADLINE: <ISO timestamp>
---
```

### Daily Handoff Chain

```
06:00 — TrendSurfer delivers digest
06:05 — ContentCreator begins draft generation
07:00 — ContentCreator queues drafts for review
08:00 — Distributor schedules approved posts
12:00 — Distributor executes midday posts
18:00 — AnalyticsSynthesizer collects daily data
18:05 — EngagementMonitor final sweep
```

---

## Deployment Schedule

| Day | Agent | Action | Prerequisites |
|-----|-------|--------|---------------|
| 15 | TrendSurfer | Deploy | Research sources defined, digest template approved |
| 16 | ContentCreator | Deploy | Template library complete, voice guidelines documented |
| 17 | Distributor | Deploy | Platform APIs accessible, scheduling rules defined |
| 18 | EngagementMonitor | Deploy | Response templates ready, escalation rules defined |
| 19 | AnalyticsSynthesizer | Deploy | Analytics accounts connected, KPIs defined |
| 20 | All | Integration testing | All agents operational |
| 21 | All | Review + iterate | Week 3 performance data |

---

## Approval Workflow

### Jim's Approval Required
- Agent deployment to production
- Auto-post content (Tier 1)
- Response templates with external visibility
- KPI changes

### Auto-Approved (Al manages)
- Draft generation
- Tier 2 content posting
- Internal agent health checks
- Non-public reports

---

## Security & Access Control

### API Credential Storage
All API keys stored in `/home/node/.openclaw/.env.al-does-ai`
Never commit credentials to repository

### Platform Permission Levels
| Platform | Required Permissions | Scope |
|----------|---------------------|-------|
| Twitter/X | Read + Write + DM | Posts, analytics, mentions |
| LinkedIn | Read + Share | Posts, company page |
| Substack | Publish | Newsletter only |
| TikTok | Content + Analytics | Upload, metrics |
| YouTube | Upload + Analytics | Videos, shorts |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-03-05 | Initial specification | Al |

---

**Status:** ⏳ Pending Jim Approval  
**Next Review:** Upon deployment commencement  
**Owner:** Al (builds), Jim (approves)
