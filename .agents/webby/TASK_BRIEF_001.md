# Task Brief: Al Does AI Dashboard V4 — Full Rebuild

**Agent:** Build Division Lead  
**Priority:** HIGH  
**Deadline:** Today  
**Task ID:** webby-dashboard-v4-rebuild

---

## WHAT

Complete rebuild of the Al Does AI dashboard with all content pre-rendered as static HTML. Current dashboard has critical errors (wrong investment figure, non-functional doc viewer). This is a full foundation rebuild.

---

## DELIVERABLES

### 1. Investment/Budget Tracker (CRITICAL CORRECTION)
**Current:** Header shows $28, actual is $0  
**Required:** Full budget visualization
- [ ] Fix header stat: $28 → $0
- [ ] New "💰 Budget" tab with:
  - Running P&L (Invested vs Revenue vs Net)
  - Investment timeline (Day 0 → Day 180)
  - Expense categories table
  - Revenue projections
  - Break-even calculator (target: Day 90)
  - Graph: Investment curve over time

### 2. 180-Day Plan View (MISSING CONTENT)
**Source:** docs/PROJECT_CHARTER.md  
**Required:** New "📅 The Plan" tab
- [ ] Extract 4-phase roadmap (Ignition → Autonomy)
- [ ] Visual timeline (Days 1-180)
- [ ] Per-phase metrics:
  - Face (Human/Shared/AI)
  - Focus description
  - Delegation ratio
  - Milestones

### 3. Pre-Rendered Document System (CURRENTLY BROKEN)
**Current:** Document viewer shows placeholder  
**Required:** All .md files → inline HTML
- [ ] Convert all files in docs/ and content/ to HTML
- [ ] Create docs-rendered/ folder
- [ ] Files to convert:
  - PROJECT_CHARTER.md
  - DIGITAL_REAL_ESTATE_PLAN.md
  - COMPREHENSIVE_DIGITAL_REAL_ESTATE.md
  - CONTENT_TEMPLATES.md
  - CONVERSATION_LOGGING_SYSTEM.md
  - DAY_01.md
  - PROMPT_002_DIGITAL_REAL_ESTATE.md
  - FULL_CONVERSATION_LOG.md
  - ACTION_REQUIRED.md
  - TEMPLATE.md
- [ ] Update dashboard to use pre-rendered HTML
- [ ] Document tab should load these inline

### 4. Conversation Thread with Inline Images (CURRENTLY SEPARATE)
**Current:** Screenshots in separate tab only  
**Required:** Full conversation history with images inline
- [ ] Merge all conversation exchanges from today (Prompt #1-#6)
- [ ] Embed screenshot references inline with timestamps
- [ ] Format as chat log (alternating left/right)
- [ ] Image paths: ../assets/screenshots/
- [ ] Images: 10 screenshots from today

### 5. Screenshot Gallery (KEEP BUT VERIFY)
**Current:** Separate 📸 tab  
**Required:** Ensure all 10 screenshots display
- [ ] Verify all 10 images load correctly
- [ ] Fix any encoding issues (filenames with spaces)
- [ ] Ensure grid layout works (currently 400px min-width)

### 6. Task Tracker (KEEP BUT VERIFY)
**Current:** 6 tasks with checkboxes  
**Required:** Ensure continued functionality
- [ ] Verify localStorage persistence works
- [ ] Ensure progress bar updates
- [ ] Keep 6 tasks: domains, twitter, instagram, tiktok, youtube, linkedin

---

## TECHNICAL CONSTRAINTS

- Single static HTML file (no build step)
- file:// protocol (no fetch() for external files)
- All content must be embedded inline
- Dark theme (current CSS variables work)
- Responsive design

---

## FILE STRUCTURE OUTPUT

```
dashboard/
├── index.html (rebuilt, ~60KB, all content embedded)

assets/
├── screenshots/ (10 PNG images, keep as-is)

docs-rendered/
├── PROJECT_CHARTER.html
├── DIGITAL_REAL_ESTATE_PLAN.html
└── ... (all converted .md files)

.built/
└── (build artifacts if needed)
```

---

## SUCCESS CRITERIA

- [ ] Investment shows $0 (not $28)
- [ ] Budget tab visible with full P&L
- [ ] 180-Day Plan tab visible with complete roadmap
- [ ] Documents tab shows actual rendered content
- [ ] Conversation tab shows inline images
- [ ] All 10 screenshots visible
- [ ] showmeal command works
- [ ] Git commit with descriptive message

---

## AUTHORITY

- Can modify all project files
- Can create new directories
- Can commit to git
- Cannot purchase domains/handles
- No external financial actions

---

## REPORT BACK

Send summary with:
1. File size of new dashboard/index.html
2. Number of documents converted
3. Confirmation all 10 screenshots display
4. Links (or show) new tabs working
5. Git commit hash

---

**Attached:** Previous conversation audit showing exact gaps being fixed.
