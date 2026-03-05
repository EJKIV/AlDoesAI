# Al Does AI

**Day 001: Building an AI collaborator from scratch, completely transparent.**

[Live Site](https://aldoesai.com) • [Dashboard](https://aldoesai.com/dashboard)

---

## What's This?

A public documentation of learning AI from zero. Every prompt, every action, every line of code — shared in real-time.

**The premise:** You can now "speak things into existence." Voice note → working system. We're documenting how.

**The twist:** My AI partner, Al, is becoming the face of this channel. By Day 180, Al will be doing 95% of the work.

---

## What's Here

| Directory | Contents |
|-----------|----------|
| `index.html` | Homepage with Day 001 intro |
| `dashboard/` | Live project dashboard with tasks, approvals, metrics |
| `content/` | Platform-specific content (Twitter threads, LinkedIn posts, etc.) |
| `docs/` | Guides, API docs, agent specs |
| `conversation/` | Every single prompt and response |
| `scripts/` | Automation scripts (Buffer posting, etc.) |
| `assets/screenshots/` | Visual progress log |

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/AlDoesAI/aldoesai.git
cd aldoesai

# Install dependencies
npm install

# Set up environment (see docs/BUFFER_API_SETUP.md)
cp .env.local.template .env.local
# Edit .env.local with your Buffer API key

# Open the dashboard
open dashboard/index.html
```

---

## The Stack

- **Frontend:** Vanilla HTML/CSS/JS (single-file dashboard)
- **Hosting:** Vercel (auto-deploy from Git)
- **Content Distribution:** Buffer GraphQL API
- **Automation:** Node.js scripts
- **Version Control:** Git (every change committed)

---

## The Agents

We're building a team of autonomous agents:

| Agent | Role | Status |
|-------|------|--------|
| Webby 🕸️ | Site maintenance | ✅ Active |
| TrendSurfer 🌊 | Research & trends | ⏳ Pending |
| ContentCreator ✍️ | Draft generation | ⏳ Pending |
| Distributor 🚀 | Cross-platform posting | ⏳ Pending |
| EngagementMonitor 📊 | Metrics & replies | ⏳ Pending |

---

## Transparency

- **Every prompt logged** in `conversation/`
- **Every dollar tracked** in `INVESTMENT_LEDGER.md`
- **Every action visible** in the dashboard
- **All code open** — fork it, use it, improve it

---

## Follow Along

- **Twitter:** [@AlDoesAI](https://twitter.com/AlDoesAI)
- **Website:** [aldoesai.com](https://aldoesai.com)
- **This Repo:** You're looking at it

---

## License

MIT — Use this however you want. Just share what you build.

---

*Day 001 of 180. Started March 5, 2026. Currently at $0 invested.*
