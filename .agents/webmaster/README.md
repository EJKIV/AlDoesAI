# Webmaster Agent — Al Does AI

**Agent ID:** webmaster  
**Purpose:** Continuously maintain and improve the Al Does AI dashboard  
**Schedule:** Daily at 6:00 AM EST  
**Runtime:** Automated subagent with human approval for major changes

---

## Responsibilities

### Daily Tasks (Automated)

1. **Screenshot Sync**
   - Check ~/Documents/AlDoesAI/screenshots for new images
   - Copy to assets/screenshots/
   - Optimize file sizes if needed
   - Update gallery HTML

2. **Content Refresh**
   - Rebuild dashboard HTML with latest conversations
   - Embed markdown documents as rendered HTML
   - Update progress statistics
   - Refresh conversation thread

3. **Health Check**
   - Verify all links work
   - Check image loading
   - Validate HTML structure
   - Test interactive features

4. **Git Commit**
   - Stage all changes
   - Commit with descriptive message
   - Push to remote (when configured)

### Weekly Tasks (Human Review Required)

1. **Design Improvements**
   - Review user feedback
   - Propose UI/UX enhancements
   - A/B test new layouts (with approval)

2. **Performance Optimization**
   - Image compression
   - CSS/JS minification
   - Load time analysis

3. **Content Strategy**
   - Suggest new sections
   - Improve navigation
   - Add documentation

---

## Implementation

### Script: webmaster-daily.sh

See: `.agents/webmaster/webmaster-daily.sh`

### Configuration: webmaster-config.json

See: `.agents/webmaster/config.json`

### Cron Setup

```bash
# Add to crontab:
0 6 * * * ~/.openclaw/workspace/projects/al-does-ai/.agents/webmaster/webmaster-daily.sh
```

---

## Human Approval Workflow

| Change Type | Auto-Execute | Requires Approval |
|-------------|--------------|-------------------|
| Screenshot sync | ✅ Yes | ❌ No |
| Content refresh | ✅ Yes | ❌ No |
| Stats update | ✅ Yes | ❌ No |
| Git commit | ✅ Yes | ❌ No |
| Design changes | ❌ No | ✅ Yes (notify Jim) |
| Major refactors | ❌ No | ✅ Yes (notify Jim) |
| New features | ❌ No | ✅ Yes (proposal first) |

---

## Reporting

**Daily Report Format:**
```
Webmaster Agent — Daily Report [DATE]

Screenshots Synced: X new
Files Updated: X
Lines Changed: +X/-X
Commits: X
Errors: 0
Status: ✅ HEALTHY

Notes: [Any issues or suggestions]
```

**Weekly Summary:**
- Traffic trends (when analytics added)
- User engagement metrics
- Performance scores
- Proposed improvements

---

## Success Metrics

- [ ] Dashboard loads in <2 seconds
- [ ] All images display correctly
- [ ] All documents readable inline
- [ ] Conversation thread complete
- [ ] No broken links
- [ ] Git history clean
- [ ] Daily commits automated

---

**Created:** March 5, 2026  
**Last Updated:** March 5, 2026  
**Version:** 1.0
