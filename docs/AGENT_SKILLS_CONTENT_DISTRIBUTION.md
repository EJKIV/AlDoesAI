# Agent Skills — Content Distribution Architecture

**Version:** 1.0  
**Date:** March 5, 2026  
**Status:** Specified (Ready for Implementation)

---

## Overview

This document specifies the 5 specialized agents needed for Day 001 content distribution and ongoing operations.

| Agent | Function | Status | Deploy |
|-------|----------|--------|--------|
| ContentExtractor | Parse source → structured blocks | ⏳ Spec | Day 2-3 |
| PlatformFormatter | Format for each channel | ⏳ Spec | Day 2-3 |
| CrossDistributor | Post + track across platforms | ⏳ Spec | Day 3-4 |
| VideoScriptGen | Generate scripts from text | ⏳ Spec | Day 4-5 |
| VisualAssetCreator | Create platform images | ⏳ Spec | Day 5-7 |

---

## Skill 1: ContentExtractor

**Purpose:** Parse source content (HTML/Markdown) into structured blocks for multi-platform distribution

### Input Format
```json
{
  "source": "path/to/content.html",
  "type": "day_001_intro",
  "extract": ["hero", "body", "quotes", "asides", "cta"]
}
```

### Output Format
```json
{
  "hero": {
    "headline": "You can speak it into existence",
    "subheadline": "Day 001 — Learning AI from zero"
  },
  "body_sections": [
    {
      "heading": "The Gap Has Collapsed",
      "paragraphs": ["...", "..."],
      "key_phrases": ["gap between idea and tangible output"]
    }
  ],
  "quotes": [
    {
      "text": "The tools have gotten so good...",
      "speaker": "Jim",
      "context": "introduction"
    }
  ],
  "asides": [
    {
      "label": "Full transparency",
      "content": "I've spent six years..."
    }
  ],
  "cta": {
    "main": "Follow @AlDoesAI",
    "secondary": "Track our progress at aldoesai.com"
  }
}
```

### Methods

#### `extract(sourcePath, options)`
Parse HTML/MD and return structured content

#### `extract_section(source, section)`
Extract specific section by identifier

#### `segment_by_length(content, maxLength)`
Break content into tweet-sized segments

#### `identify_hook(content)`
Find most quotable/punchy lines

### Implementation Approach
```javascript
const cheerio = require('cheerio');

class ContentExtractor {
  extract(html, options = {}) {
    const $ = cheerio.load(html);
    
    return {
      hero: this.extractHero($),
      body: this.extractBody($),
      quotes: this.extractQuotes($),
      asides: this.extractAsides($),
      cta: this.extractCTA($)
    };
  }
  
  extractHero($) {
    return {
      headline: $('h1').first().text(),
      subheadline: $('.opening').first().text()
    };
  }
  
  // ... additional methods
}
```

---

## Skill 2: PlatformFormatter

**Purpose:** Adapt structured content for each platform's constraints and audience

### Platform Configs

#### Twitter
```json
{
  "max_length": 280,
  "thread_max": 15,
  "format": "thread",
  "includes": ["hashtags", "mentions"],
  "style": "punchy, quotable, visual line breaks"
}
```

#### LinkedIn
```json
{
  "max_length": 3000,
  "format": "long_form",
  "includes": ["professional_angle", "business_value"],
  "style": "paragraphs, clear structure, CTA at end"
}
```

#### Substack
```json
{
  "format": "full_essay",
  "includes": ["complete_narrative", "appendix", "links"],
  "style": "narrative flow, sections, reading time"
}
```

#### TikTok
```json
{
  "max_duration": 60,
  "format": "script_with_broll",
  "includes": ["visual_cues", "timestamp_breakdown"],
  "style": "hook, problem, solution, CTA"
}
```

#### YouTube
```json
{
  "max_duration": 180,
  "format": "trailer_script",
  "includes": ["sections", "broll_notes", "music_cues"],
  "style": "A-roll, B-roll, graphics, voiceover balance"
}
```

### Methods

#### `format(content, platform, options)`
Main entry point

#### `format_thread(content, maxTweets)`
Twitter thread builder with logical breaks

#### `format_longform(content, maxLength)`
LinkedIn/Substack adapter

#### `format_script(content, duration, platform)`
Video platform script generator

### Example Transformation

**Input (Hero):**
"You can speak it into existence. We're living through something extraordinary."

**Output (Twitter thread, tweet 1):**
```
Day 001:

I started something today.

Every prompt. Every action. Every dollar.
Completely transparent. Starting from zero.

This is how I'm learning AI — and how you can too.

A thread 🧵
```

**Output (LinkedIn hook):**
```
I'm starting a public experiment:

180 days. $0 budget. Complete transparency.

I'm documenting everything I build with AI — every prompt, every workflow, every mistake.

Why? Because I believe most people are one or two interactions away from understanding what's possible — and they just haven't had the right introduction yet.
```

---

## Skill 3: CrossDistributor

**Purpose:** Distribute content to multiple platforms with tracking and logging

### Supported Platforms

| Platform | API | Auth | Rate Limit |
|----------|-----|------|------------|
| Twitter/X | v2 | OAuth 2.0 | 300/3hr |
| LinkedIn | v2 | OAuth 2.0 | 100/day |
| Reddit | PRAW | OAuth | 60/min |
| Discord | Webhook | Token | Unlimited |
| Substack | Manual | Email | N/A |
| Hacker News | Native | Cookie | Limited |

### Input
```json
{
  "content": {
    "twitter": "...thread...",
    "linkedin": "...post...",
    "reddit": "...post..."
  },
  "platforms": ["twitter", "linkedin", "reddit"],
  "schedule": {
    "twitter": "2026-03-05T08:00:00-05:00",
    "linkedin": "2026-03-05T09:00:00-05:00"
  }
}
```

### Output
```json
{
  "results": [
    {
      "platform": "twitter",
      "status": "posted",
      "url": "https://twitter.com/AlDoesAI/...",
      "id": "...",
      "timestamp": "..."
    },
    {
      "platform": "linkedin",
      "status": "scheduled",
      "scheduled_for": "..."
    }
  ],
  "meta": {
    "total_platforms": 3,
    "successful": 2,
    "failed": 0,
    "scheduled": 1
  }
}
```

### Methods

#### `post(content, platform, options)`
Post to single platform

#### `distribute(content_map, platforms, schedule)`
Multi-platform distribution

#### `schedule(platform, time)`
Schedule for optimal time

#### `track(post_id, platform)`
Monitor engagement metrics

#### `reply(post_id, content, platform)`
Respond to comments

### Implementation

```javascript
class CrossDistributor {
  constructor(config) {
    this.platforms = {
      twitter: new TwitterClient(config.twitter),
      linkedin: new LinkedInClient(config.linkedin),
      reddit: new RedditClient(config.reddit),
      // ... others
    };
  }
  
  async distribute(contentMap, platformList, schedule = {}) {
    const results = [];
    
    for (const platform of platformList) {
      try {
        const result = await this.post(contentMap[platform], platform);
        results.push(result);
        
        // Log to dashboard
        this.logToDashboard(platform, result);
      } catch (err) {
        results.push({
          platform,
          status: 'failed',
          error: err.message
        });
      }
    }
    
    return results;
  }
}
```

---

## Skill 4: VideoScriptGen

**Purpose:** Generate video scripts with B-roll notes from text content

### Input
```json
{
  "content": {
    "hero": {...},
    "body_sections": [...],
    "quotes": [...],
    "cta": {...}
  },
  "duration": 60,
  "platform": "tiktok",
  "style": "educational_hook"
}
```

### Output
```json
{
  "title": "Day 001: You Can Speak It Into Existence",
  "total_duration": 60,
  "segments": [
    {
      "timestamp": "0-3",
      "duration": 3,
      "audio": "Text overlay: '$0 → AI Business'",
      "visual": "Black screen, text animation",
      "broll": [],
      "notes": "Hook text only, no voiceover"
    },
    {
      "timestamp": "3-8",
      "duration": 5,
      "audio": "I started something today. 180 days. Every prompt. Every action. Completely transparent.",
      "visual": "Jim to camera, close-up",
      "broll": [],
      "notes": "Personal, energetic delivery"
    },
    {
      "timestamp": "8-18",
      "duration": 10,
      "audio": "You can now speak ideas into existence. Voice note to working system.",
      "visual": "Screen recording of dashboard",
      "broll": ["Terminal typing", "Dashboard animation"],
      "notes": "Show, don't tell"
    }
    // ... more segments
  ],
  "captions": [
    {"time": 0, "text": "$0 → AI Business"},
    {"time": 3, "text": "I started something today"},
    // ...
  ],
  "music_cues": [
    {"time": 0, "type": "intro_beat", "duration": 5},
    {"time": 45, "type": "build_up", "duration": 10},
    {"time": 55, "type": "outro_beat", "duration": 5}
  ],
  "export_settings": {
    "resolution": "1080x1920",
    "fps": 30,
    "format": "mp4"
  }
}
```

### Methods

#### `generate(content, duration, platform)`
Main script generator

#### `break_into_segments(script, maxDuration)`
Timestamp-based segmentation

#### `suggest_broll(segment, platform)`
Visual asset recommendations

#### `generate_captions(script)`
Auto-generate caption timing

---

## Skill 5: VisualAssetCreator

**Purpose:** Create platform-optimized images and graphics

### Supported Outputs

| Type | Dimensions | Format | Platforms |
|------|------------|--------|-----------|
| Twitter Card | 1200x675 | PNG | Twitter, LinkedIn |
| Instagram Square | 1080x1080 | JPG | Instagram |
| Instagram Story | 1080x1920 | JPG | Instagram |
| YouTube Thumbnail | 1280x720 | JPG | YouTube |
| TikTok Cover | 1080x1920 | JPG | TikTok |
| Quote Card | 1200x1200 | PNG | All |
| Carousel Slide | 1080x1350 | PNG | LinkedIn, Instagram |

### Input
```json
{
  "type": "quote_card",
  "quote": "You can speak it into existence",
  "speaker": "Jim, Day 001",
  "style": "dark_theme",
  "dimensions": {"width": 1200, "height": 1200}
}
```

### Output
```json
{
  "file": "assets/visuals/quote_day001_speakit.png",
  "url": "...",
  "metadata": {
    "created": "...",
    "type": "quote_card",
    "used_in": ["twitter", "linkedin", "instagram"]
  }
}
```

### Methods

#### `create(type, content, style)`
Main creation method

#### `create_quote_card(quote, speaker, style)`
Quote-focused graphic

#### `create_thumbnail(video_title, style)`
YouTube/TikTok thumbnail

#### `create_carousel(content_list, style)`
Multi-slide LinkedIn/Instagram

### Implementation Options

**Option A: HTML-to-Image (Puppeteer)**
```javascript
const puppeteer = require('puppeteer');

async function renderToImage(html, dimensions) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport(dimensions);
  await page.setContent(html);
  await page.screenshot({ path: 'output.png' });
  await browser.close();
}
```

**Option B: Canvas API (Node)**
```javascript
const { createCanvas } = require('canvas');

function createQuoteCard(quote, speaker) {
  const canvas = createCanvas(1200, 1200);
  const ctx = canvas.getContext('2d');
  // Draw background, text, etc.
  return canvas.toBuffer('image/png');
}
```

**Option C: Canva/Figma API (External)**
Use platform APIs if/when available

---

## Coordination: The Distribution Workflow

### Full Pipeline (Day 1 → Publish)

```
Source Content (Claude output)
       ↓
ContentExtractor.parse()
       ↓
Structured Content Object
       ↓
PlatformFormatter.format(platform)
       ↓
Platform-Specific Content
       ↓
VideoScriptGen.generate(platform)
       ↓
Video Scripts (TikTok, YouTube)
       ↓
VisualAssetCreator.create(type)
       ↓
Visual Assets (thumbnails, quotes)
       ↓
CrossDistributor.distribute(schedule)
       ↓
Published Across Platforms
       ↓
Engagement Tracking
```

### Agent Communication

```json
{
  "from": "PlatformFormatter",
  "to": "CrossDistributor",
  "task": "Distribute formatted content",
  "data": {
    "twitter": "...thread...",
    "linkedin": "...post...",
    "reddit": "...post..."
  },
  "schedule": {
    "twitter": "2026-03-05T08:00:00-05:00",
    "linkedin": "2026-03-05T09:00:00-05:00"
  }
}
```

---

## Tools Required

### Node.js Packages
```json
{
  "dependencies": {
    "cheerio": "^1.0.0-rc.12",
    "puppeteer": "^21.0.0",
    "canvas": "^2.11.2",
    "twitter-api-v2": "^1.15.0",
    "axios": "^1.6.0",
    "marked": "^11.0.0"
  }
}
```

### API Access
- Twitter Developer Account (v2 API)
- LinkedIn Developer Program
- Reddit API (PRAW or OAuth)
- Discord Webhook URL
- Substack (manual or unofficial API)

### External Tools
- CapCut/VN Editor (video editing)
- Canva (templates/Figma if available)
- Descript (audio/video transcription)

---

## Success Metrics

### Day 1 Targets
| Metric | Target |
|--------|--------|
| Platforms posted | 5+ |
| Time to distribute | <30 min |
| Manual intervention | 1 (Jim approval) |
| Error rate | <10% |

### First Week
- Average time per post: <15 min
- Automation ratio: 80%+
- Cross-platform efficiency: 5 platforms per creation cycle

---

## Next Steps for Implementation

1. ✅ Spec complete (this document)
2. ⏳ Set up API credentials for each platform
3. ⏳ Implement ContentExtractor
4. ⏳ Implement PlatformFormatter
5. ⏳ Implement CrossDistributor
6. ⏳ Implement VideoScriptGen
7. ⏳ Implement VisualAssetCreator
8. ⏳ Test full pipeline with Day 002 content

---

**Document Status:** ✅ Spec Final  
**Implementation Priority:** High (Days 2-7)
