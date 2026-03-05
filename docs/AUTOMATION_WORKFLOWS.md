# Automation Workflows — Al Does AI

**Version:** 1.0  
**Date:** March 5, 2026  
**Status:** Configured (Ready for Deployment)

---

## Workflow Overview

| Workflow | Trigger | Frequency | Output |
|----------|---------|-----------|--------|
| Morning Digest | Cron | Daily 6:00 AM | Research report |
| Content Creation | Agent | Daily 7:00 AM | 3 daily post drafts |
| Cross-Platform Post | Agent | Scheduled | Published content |
| Engagement Monitor | Cron | Hourly | Metrics + alerts |
| Evening Synthesis | Agent | Daily 6:00 PM | Reports + queue |
| Weekly Deep-Dive | Cron | Sunday 6:00 PM | Substack + video |

---

## Workflow 1: Morning Research Digest

**Agent:** TrendTracker  
**Trigger:** 2026-03-05 06:00:00 EST (and daily)  
**Priority:** HIGH

### Process

```yaml
name: morning-research-digest
trigger:
  type: cron
  schedule: "0 6 * * *"
  timezone: America/New_York

steps:
  - name: scan_sources
    sources:
      - openclaw_github
      - anthropic_blog
      - openai_blog
      - reddit_local_llama
      - hackernews_ai
      - twitter_ai_list
      - youtube_tutorials
      - discord_channels
    scan_depth: top_10_per_source
    timeout: 15min

  - name: filter_relevance
    criteria:
      relevance_to_project: high
      actionability: actionable
      recency: < 24h
      novelty: not_duplicate
    min_results: 5
    max_results: 10

  - name: generate_digest
    format: markdown
    sections:
      - morning_headlines
      - trending_topics
      - content_opportunities
      - agent_updates
      - research_queue_additions

  - name: notify_jim
    method: dashboard_notification
    priority: high
    include: digest_link

  - name: update_dashboard
    target: research_queue
    action: append_new_findings
```

### Output Location
- `research/daily/YYYY-MM-DD-morning-digest.md`
- Dashboard: 🔄 Machine tab → Research Queue

---

## Workflow 2: Content Creation (Daily Posts)

**Agent:** ContentCreator  
**Trigger:** Cron + Manual  
**Priority:** HIGH

### Process

```yaml
name: daily-content-creation
trigger:
  - type: cron
    schedule: "0 7 * * *"
  - type: manual
    command: spawn content-creator

inputs:
  - morning_digest
  - trending_topics
  - content_calendar
  - template_library

steps:
  - name: select_topic
    source: morning_digest.content_opportunities
    criteria:
      - aligns_with_brand
      - beginner_accessible
      - educational_value
      - unique_angle
    output: primary_topic

  - name: generate_drafts
    outputs:
      - twitter_thread:
          format: thread_5_to_10_tweets
          style: punchy_quotable
      - linkedin_post:
          format: long_form_300_words
          style: professional_business
      - tiktok_script:
          format: 60sec_with_broll
          style: hook_problem_solution_cta
    max_drafts: 3

  - name: queue_for_review
    action: add_to_pending_queue
    notify: jim
    include:
      - draft_content
      - suggested_hashtags
      - recommended_post_time
      - confidence_score

  - name: await_approval
    timeout: 4hr
    fallback: escalate_to_jim
```

### Output Location
- `content/pending/YYYY-MM-DD-twitter-draft.md`
- `content/pending/YYYY-MM-DD-linkedin-draft.md`
- `content/pending/YYYY-MM-DD-tiktok-script.md`
- Dashboard: 🎯 Today tab → Content Today

---

## Workflow 3: Cross-Platform Distribution

**Agent:** CrossDistributor  
**Trigger:** Approved content + Schedule  
**Priority:** HIGH

### Process

```yaml
name: cross-platform-distribution
trigger:
  - type: manual_approval
    source: content_queue
  - type: scheduled
    times:
      - "08:00"
      - "12:00"
      - "18:00"

platforms:
  twitter:
    enabled: true
    auth_method: oauth_v2
    rate_limit: 300_per_3hr
    format: thread
    optimal_times: ["08:00", "12:00", "17:00"]

  linkedin:
    enabled: true
    auth_method: oauth_v2
    rate_limit: 100_per_day
    format: long_form
    optimal_times: ["09:00", "11:00", "17:00"]

  reddit:
    enabled: true
    subreddits:
      - r/LocalLLaMA
      - r/MachineLearning
      - r/artificial
    rate_limit: 30_per_hour
    format: markdown_post

  hackernews:
    enabled: true
    method: manual_submission
    format: show_hn

  discord:
    enabled: true
    method: webhook
    channels:
      - announcements
      - content_feed

  substack:
    enabled: true
    method: manual_with_template
    frequency: weekly
    optimal_time: "Sunday 10:00"

steps:
  - name: format_for_platform
    input: approved_content
    output: platform_specific_versions

  - name: create_visuals
    agent: VisualAssetCreator
    output: platform_images

  - name: schedule_posts
    action: queue_with_timestamp
    respect_optimal_times: true

  - name: execute_posts
    action: publish_to_platforms
    order:
      - twitter (primary)
      - linkedin (+30min)
      - reddit (+60min)
      - others (+staggered)

  - name: log_results
    action: update_dashboard
    fields:
      - platform
      - post_url
      - timestamp
      - status
      - engagement_preview
```

### Output Location
- Dashboard: 📊 Distribution tab → Published Today
- `analytics/posts/YYYY-MM-DD-post-log.json`

---

## Workflow 4: Engagement Monitor

**Agent:** Analytics  
**Trigger:** Cron (hourly)  
**Priority:** MEDIUM

### Process

```yaml
name: engagement-monitoring
trigger:
  type: cron
  schedule: "0 * * * *"

platforms: [twitter, linkedin, reddit, youtube, substack]

steps:
  - name: collect_metrics
    metrics:
      twitter:
        - impressions
        - engagements
        - retweets
        - replies
        - likes
        - link_clicks
      linkedin:
        - impressions
        - reactions
        - comments
        - shares
        - clicks
      reddit:
        - upvotes
        - comments
        - award_count

  - name: identify_priority_engagements
    criteria:
      - high_engagement_score
      - influential_commenter
      - question_asked
      - criticism_raised
    action: flag_for_jim

  - name: auto_respond
    conditions:
      - faq_match
      - appreciation_comment
    response: standard_thank_you
    limit: 5_per_hour

  - name: generate_report
    format: hourly_snapshot
    include:
      - top_performing_post
      - engagement_rate
      - new_followers
      - flagged_items

  - name: notify_if_anomaly
    conditions:
      - engagement_spike: >2x_avg
      - negative_sentiment_surge
      - technical_issue_detected
```

### Output Location
- Dashboard: 📊 Distribution tab → Live Metrics
- `analytics/hourly/YYYY-MM-DD-HH.json`

---

## Workflow 5: Evening Synthesis

**Agent:** ContentCreator + Analytics  
**Trigger:** Cron 6:00 PM  
**Priority:** MEDIUM

### Process

```yaml
name: evening-synthesis
trigger:
  type: cron
  schedule: "0 18 * * *"

steps:
  - name: compile_day_metrics
    sources:
      - hourly_reports
      - platform_analytics
      - engagement_logs
    output: daily_summary

  - name: generate_performance_insights
    identify:
      - best_performing_content
      - worst_performing_content
      - engagement_patterns
      - audience_growth
    format: bulleted_insights

  - name: adjust_queue
    action: reprioritize
    based_on:
      - today_performance
      - tomorrow_schedule
      - trending_topics

  - name: prepare_tomorrow_brief
    output:
      - topic_recommendation
      - suggested_template
      - optimal_post_times
      - jim_tasks

  - name: update_dashboard
    sections_updated:
      - 🎯 Today (tomorrow)
      - 📊 Distribution (today results)
      - 💰 Budget (if revenue/expenses)
```

### Output Location
- Dashboard: 🎯 Today tab (next day preview)
- `reports/daily/YYYY-MM-DD-summary.md`

---

## Workflow 6: Weekly Deep-Dive

**Agent:** ContentCreator (long-form)  
**Trigger:** Sunday 6:00 PM  
**Priority:** HIGH

### Process

```yaml
name: weekly-deep-dive
trigger:
  type: cron
  schedule: "0 18 * * 0"
  timezone: America/New_York

steps:
  - name: compile_week_content
    sources:
      - all_daily_posts
      - engagement_summary
      - agent_deployments
      - lessons_learned

  - name: generate_substack
    format: essay
    sections:
      - week_in_review
      - the_numbers
      - what_worked
      - what_didnt
      - agent_progress
      - next_week_preview
    length: 1500_2000_words
    include_screenshots: true

  - name: generate_video_script
    agent: VideoScriptGen
    outputs:
      - youtube_full: 5_10_min_script
      - tiktok_highlights: 60sec_clips

  - name: create_visual_assets
    agent: VisualAssetCreator
    outputs:
      - youtube_thumbnail
      - quote_cards
      - carousel_posts

  - name: schedule_distribution
    timeline:
      - sunday_20:00: substack_publish
      - monday_08:00: twitter_thread_summary
      - monday_09:00: linkedin_post
      - monday_12:00: youtube_publish
      - tuesday_friday: tiktok_highlights

  - name: notify_jim
    message: "Week X is ready for review"
    include: preview_links
    require_approval: true
```

### Output Location
- `content/substack/YYYY-MM-DD-week-X.md`
- `content/youtube/week-X-script.md`
- Dashboard: 📄 Documents tab → Weekly Recaps

---

## Cron Job Configuration

### Main Crontab

```bash
# Al Does AI — Automation Schedule
# Run every 10 minutes — main orchestrator
*/10 * * * * cd ~/.openclaw/workspace/projects/al-does-ai && node workflows/orchestrator.js

# Daily 6:00 AM — Morning Research Digest
0 6 * * * cd ~/.openclaw/workspace/projects/al-does-ai && node workflows/morning-digest.js

# Daily 7:00 AM — Content Creation
0 7 * * * cd ~/.openclaw/workspace/projects/al-does-ai && node workflows/content-creator.js

# Daily 8:00 AM, 12:00 PM, 6:00 PM — Distribution
0 8,12,18 * * * cd ~/.openclaw/workspace/projects/al-does-ai && node workflows/distribute.js

# Hourly — Engagement Monitor
0 * * * * cd ~/.openclaw/workspace/projects/al-does-ai && node workflows/engagement-monitor.js

# Daily 6:00 PM — Evening Synthesis
0 18 * * * cd ~/.openclaw/workspace/projects/al-does-ai && node workflows/evening-synthesis.js

# Sunday 6:00 PM — Weekly Deep-Dive
0 18 * * 0 cd ~/.openclaw/workspace/projects/al-does-ai && node workflows/weekly-dive.js

# Daily Auto-Update (Webby)
0 6 * * * cd ~/.openclaw/workspace/projects/al-does-ai && ./.agents/webby/webby-run.sh
```

### Orchestrator Logic

```javascript
// workflows/orchestrator.js
const fs = require('fs');
const path = require('path');

class Orchestrator {
  constructor() {
    this.stateFile = path.join(__dirname, '../.orchestrator-state.json');
    this.loadState();
  }

  loadState() {
    if (fs.existsSync(this.stateFile)) {
      this.state = JSON.parse(fs.readFileSync(this.stateFile));
    } else {
      this.state = { lastRun: null, activeWorkflows: [] };
    }
  }

  saveState() {
    fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2));
  }

  async run() {
    console.log(`[${new Date().toISOString()}] Orchestrator check...`);
    
    // Check if workflows are due
    const dueWorkflows = this.getDueWorkflows();
    
    for (const workflow of dueWorkflows) {
      if (!this.isRunning(workflow.name)) {
        await this.spawnWorkflow(workflow);
      }
    }
    
    this.state.lastRun = new Date().toISOString();
    this.saveState();
  }

  getDueWorkflows() {
    // Check schedule, pending approvals, etc.
    return []; // Implementation
  }

  isRunning(name) {
    return this.state.activeWorkflows.includes(name);
  }

  async spawnWorkflow(workflow) {
    console.log(`Spawning: ${workflow.name}`);
    this.state.activeWorkflows.push(workflow.name);
    this.saveState();
    
    try {
      // Spawn subagent or run local
      await workflow.execute();
    } finally {
      this.state.activeWorkflows = this.state.activeWorkflows.filter(w => w !== workflow.name);
      this.saveState();
    }
  }
}

// Run every 10 minutes via cron
new Orchestrator().run();
```

---

## Manual Trigger Commands

```bash
# Spawn specific workflow manually
openclaw spawn workflow --name morning-digest

# Force content creation
openclaw spawn workflow --name content-creator --topic "OpenClaw security"

# Emergency stop all workflows
openclaw workflow stop --all

# Check workflow status
openclaw workflow status

# View logs
openclaw workflow logs --tail 100
```

---

## Error Handling

```yaml
error_handling:
  retry_policy:
    max_retries: 3
    backoff: exponential
  notification:
    critical: immediate_sms
    error: dashboard_alert
    warning: log_only
  fallback:
    workflow_fails: notify_jim_manual_override
    agent_crashes: restart_with_debug
    api_rate_limited: queue_and_retry
```

---

**Status:** ✅ Configured  
**Next:** Install cron jobs + test Day 002  
**Owner:** Al (automate), Jim (monitor/approve)
