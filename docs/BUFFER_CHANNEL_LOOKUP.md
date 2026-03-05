# Buffer Channel Lookup — Alternative Methods

Since the GraphQL schema might use different field names, try these:

## Method 1: Direct Channel Query (No Org ID Needed)

```bash
curl -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "query": "query { channels { id service username formatted_username } }"
  }'
```

If this works, you don't even need Organization ID!

---

## Method 2: Account-Level Channels

```bash
curl -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "query": "query { account { channels { id service username } } }"
  }'
```

---

## Method 3: With Organization But Different Field

Try these variations on `channels` field name:
- `channels` ✓ (most likely)
- `Channels` (capitalized)
- `socialChannels`
- `profiles`
- `Profiles`
- `accounts`
- `connectedChannels`
- `socialProfiles`

Example with different casing:
```bash
  -d '{"query": "query { organization(id: \"YOUR_ORG_ID\") { Channels { id service } } }"}'
```

---

## Method 4: Buffer Web Browser (100% Reliable)

Since API is being tricky, just grab them from the web:

1. Go to: https://publish.buffer.com
2. Look at your connected accounts (Twitter, TikTok, Instagram)
3. **Chrome DevTools → Network**
4. Refresh page
5. Filter by "graphql" or "buffer"
6. Click request → **Response** tab
7. Search (Cmd+F) for `"id"` and `"twitter"`
8. The IDs are the long alphanumeric strings next to each

---

## Method 5: Simple POST from Browser

In Chrome console while on Buffer dashboard:

```javascript
fetch('https://api.buffer.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    query: `{ channels { id service username } }`
  })
}).then(r => r.json()).then(console.log)
```

This will show you exactly what fields are available.

---

## Fallback: Manual Entry

If you can see your accounts in Buffer, you can get IDs via:

**Buffer Settings → Connected Accounts → Export**

Or email `support@buffer.com`:
> "I'm building an integration and need my channel IDs for the GraphQL API. Can you provide them?"

They typically respond within a few hours.

---

## Once You Have IDs

Add to `.env.local`:

```bash
BUFFER_TWITTER_PROFILE_ID=abc123_from_buffer
BUFFER_TIKTOK_PROFILE_ID=def456_from_buffer
BUFFER_INSTAGRAM_PROFILE_ID=ghi789_from_buffer
```

Then we can start posting!

---

**Recommended: Try Method 1 first** (direct channel query). It's the simplest and might just work.
