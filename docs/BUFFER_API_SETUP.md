# Buffer API Setup Guide — Updated March 2026

**⚠️ Current Situation:** Buffer is transitioning to a new API. Documentation may be in flux.

---

## Option 1: Organization ID (Current Method)

Buffer is moving to an **organization-based API**. If you have an Organization ID, you may be able to use the new endpoints.

### What You Need
1. **Organization ID** (from your Buffer dashboard)
2. **API Key** or **Access Token** (depends on your account type)

### Setup

**Check your Buffer dashboard:**
- Go to https://buffer.com
- Account → Settings → Developer
- Look for "Organization ID" or "API Access"

**Add to `.env.local`:**
```bash
BUFFER_ORGANIZATION_ID=your_org_id_here
BUFFER_API_KEY=your_key_here
# OR
BUFFER_ACCESS_TOKEN=your_token_here
```

**Test the connection:**
```bash
curl -H "Authorization: Bearer $BUFFER_API_KEY" \
  "https://bufferapp.com/1/profiles.json?organization_id=$BUFFER_ORGANIZATION_ID"
```

---

## Option 2: Personal Access Token (Legacy)

If the new API isn't fully rolled out to your account:

1. Go to https://buffer.com
2. Account → Settings → Access Tokens
3. Generate a Personal Access Token
4. Use this token directly:

```bash
BUFFER_ACCESS_TOKEN=your_token_here
```

**Test:**
```bash
curl "https://api.bufferapp.com/1/profiles.json?access_token=$BUFFER_ACCESS_TOKEN"
```

---

## Option 3: Manual/Fallback (Recommended While API is in Flux)

Since Buffer is transitioning APIs, the most reliable approach for now:

### Method A: Zapier Integration (Easiest)
1. Create Zapier account (free tier: 100 tasks/month)
2. Connect RSS feed or webhook → Buffer
3. Use: `POST https://hooks.zapier.com/hooks/catch/.../.../`

```bash
# In .env.local
ZAPIER_HOOK_URL=https://hooks.zapier.com/hooks/catch/your/hook/url
```

### Method B: Buffer Web Interface + Bookmarklet
- Create a browser bookmarklet that prefills Buffer
- Not programmable, but reliable
- Good for manual posting while API stabilizes

### Method C: Native APIs (Twitter/LinkedIn Direct)
Skip Buffer, post directly:
- **Twitter:** Use v2 API (we have scripts ready)
- **LinkedIn:** Use v2 API (we have scripts ready)
- **Substack:** Manual import (no API available)

---

## Current Recommendation

**Jim, try this order:**

1. **First:** Try Organization ID + API Key approach
   - Test with curl (see above)
   - If it works → document for followers

2. **If that fails:** Use Personal Access Token (legacy endpoint)

3. **If both fail:** Use **Zapier** as reliable middleware
   - Create "Webhooks by Zapier" → "Buffer" Zap
   - POST to Zapier hook → Zapier posts to Buffer

4. **For followers:** Start with **Zapier** (easiest, $0)
   - When Buffer API stabilizes, migrate to direct API

---

## For Content Distribution (Immediate)

### Quick Path: Zapier
**Cost:** Free tier (100 posts/month)  
**Setup time:** 10 minutes  
**Reliability:** High

1. Create Zapier account
2. "Webhooks by Zapier" (trigger)
3. "Buffer" (action)
4. Copy webhook URL
5. Add to `.env.local`: `ZAPIER_HOOK_URL=...`

### Medium Path: Native Twitter/LinkedIn APIs
**Cost:** Free  
**Setup time:** 30 minutes (get keys)  
**Reliability:** High  
**Downside:** No scheduling, immediate post only

### Long Path: Wait for Buffer API Stabilization
**Timeline:** Unknown (weeks? months?)  
**Best for:** When you have time to update the integration

---

## Documentation for Followers

Add to your docs:

```markdown
## Buffer API Status (March 2026)

Buffer is transitioning APIs. Current options:

- **Option A:** Organization ID + API Key (new, experimental)
- **Option B:** Personal Access Token (legacy, may be deprecated)
- **Option C:** Zapier integration (stable, easy) ← **RECOMMENDED**
- **Option D:** Native Twitter/LinkedIn APIs (most control)

Choose based on your comfort level with APIs.
```

---

## Next Steps

1. **Test your Organization ID** with curl
2. **If it works:** We update scripts to support org-based API
3. **If it fails:** We implement **Zapier** as primary path
4. **Document:** Share which method works for your followers

**Your call:** Which path should we prioritize? Organization ID test, or Zapier integration?
