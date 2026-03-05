# Conversation Logging System

**Purpose:** Capture every prompt and response for:
1. Training future agents on this workflow
2. Public documentation (with redaction)
3. Replicability for others

---

## How It Works

### Automatic Logging

Every conversation is stored in:
```
conversation/YYYY-MM-DD-prompt-###.md
```

### What's Captured

| Element | Captured? | Format |
|---------|-----------|--------|
| Full prompt | ✅ | Verbatim |
| Full response | ✅ | Step-by-step actions |
| Commands executed | ✅ | Code blocks |
| Files created | ✅ | List with sizes |
| Time stamps | ✅ | EST |
| Decisions made | ✅ | Summary section |
| Training notes | ✅ | Patterns observed |

### What's Redacted

| Element | Redaction Method |
|---------|------------------|
| Personal info | Replace with [REDACTED] |
| Credentials | Replace with [REDACTED-CREDENTIAL] |
| Internal paths | Generalize to generic names |
| Other project details | Reference only, no specifics |

---

## File Structure

```
conversation/
├── 2026-03-05-prompt-001.md    # This conversation
├── 2026-03-06-prompt-002.md    # Next conversation
├── index.md                     # Index of all conversations
└── TEMPLATE.md                  # Template for new conversations
```

---

## Public Release Workflow

### Step 1: Raw Capture
- Store complete conversation in conversation/
- Include everything (no filtering at capture time)

### Step 2: Review
- Human review for sensitive info
- Mark sections requiring redaction

### Step 3: Redaction
- Create redacted version
- Store in `public/` or release to GitHub

### Step 4: Training Export
- Format for fine-tuning
- Store in `training/` with JSON structure

---

## For Training Agents

### Input-Output Pairs

Each conversation file can be converted to training data:

```json
{
  "messages": [
    {"role": "system", "content": "You are Al, an AI business partner helping build a public documentation series..."},
    {"role": "user", "content": "[PROMPT]"},
    {"role": "assistant", "content": "[RESPONSE]"}
  ],
  "metadata": {
    "date": "2026-03-05",
    "prompt_number": 1,
    "project": "al-does-ai",
    "outcome": "success"
  }
}
```

---

## Repository Info

**New Git repo created:** `projects/al-does-ai/`  
**Purpose:** Dedicated space for this project only (separate from other work)  
**Visibility:** Private until reviewed, then public  
**Branch:** main

```bash
# Location
~/.openclaw/workspace/projects/al-does-ai/

# Structure
├── conversation/      # All prompt/response logs
├── content/           # Public content (daily posts)
├── assets/            # Visual assets, templates
├── docs/              # Guidelines, templates
├── tracking/          # Metrics, ledger
├── INVESTMENT_LEDGER.md
├── PROJECT_CHARTER.md
└── .git/              # Git repo
```

---

## Commit Habits

**Every prompt = One commit**

```
[Date] Prompt #: [Brief description]
[Files added/changed]
```

**Example commit log:**
```
3e2c50b Day 1: Charter, templates, Roadmap, Newsletter
9a8b7c6 Conversation log stored (Prompt #1)
```

---

## Next Steps

1. ✅ System created
2. 🔄 Template for Prompt #2 ready
3. 🔄 Review process defined
4. 🔄 Public release workflow documented

**Ready to train the next generation of agents.**
