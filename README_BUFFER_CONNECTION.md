# Buffer GraphQL API Connection — How It Works

**Date:** March 5, 2026  
**Status:** ✅ Fully Operational

---

## What I Did (Automated Discovery)

When the Buffer API docs showed `channels` instead of `profiles`, I ran automated GraphQL introspection queries against the live Buffer API to discover the correct schema.

### The Process:

1. **Read current docs** at https://developers.buffer.com/guides/getting-started.html
2. **Discovered:** Buffer uses GraphQL (not REST) with endpoint `https://api.buffer.com`
3. **Problem:** Docs said use `organization { profiles { id } }` but schema rejected "profiles"
4. **Solution:** **Automated introspection** to find actual field names
5. **Ran diagnostic queries** (in background) to test variations:
   - `channels` → ✅ Found it, but needs `organizationId` input
   - `channels` with proper input → ✅ Returns profile IDs
   - Introspected `Channel` type → Found available fields

### Automated Queries Run:

```graphql
# Step 1: Get Organizations
query { account { organizations { id } } }

# Step 2: Introspect Organization type
{ __type(name: "Organization") { fields { name } } }

# Step 3: Test "channels" with input arg
query { channels(input: {organizationId: "..."}) { id service } }

# Step 4: Introspect Channel type
{ __type(name: "Channel") { fields { name type { name } } } }

# Step 5: Get full channel data
query { 
  channels(input: {organizationId: "..."}) { 
    id service displayName name externalLink 
  } 
}
```

### Discovered Schema:

| Field | Type | Usage |
|-------|------|-------|
| `channels` | Query | Requires `ChannelsInput!` with `organizationId` |
| `id` | String | Profile ID for posting |
| `service` | Enum | twitter, instagram, tiktok, etc. |
| `displayName` | String | Handle (@AlDoesAI) |
| `externalLink` | String | Full URL |

---

## Results

**Connected Channels:**
- **Twitter:** @AlDoesAI (ID: 69aa063e...)
- **Instagram:** @aldoesai (ID: 69aa04ab...)
- **TikTok:** @aldoesai (ID: 69aa07b6...)

---

## The Code

**Script:** `scripts/buffer-graphql.js`

Uses the discovered schema to:
- Get channels with Organization ID
- Create posts via GraphQL mutation
- Support Twitter, Instagram, TikTok

**Usage:**
```bash
node buffer-graphql.js post twitter "Your text here"
```

---

## Why This Matters

Buffer's GraphQL schema isn't fully documented (fields like `channels` aren't in the getting-started guide). **Automated introspection discovered the working API contract** without waiting for documentation.

This is exactly the kind of thing Al Does AI documents — the actual working code, not just the docs.

---

**Connection verified:** March 5, 2026 18:17 EST
