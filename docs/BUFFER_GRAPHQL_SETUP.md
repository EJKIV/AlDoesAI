# Buffer GraphQL API — Complete Setup

**Status:** ✅ Org ID confirmed working  
**Next:** Get profiles → Create test post

---

## Step 1: Save Your Credentials

Add to `~/.openclaw/workspace/projects/al-does-ai/.env.local`:

```bash
BUFFER_API_KEY=your_api_key_here
BUFFER_ORGANIZATION_ID=your_org_id_here
```

Test with:
```bash
source .env.local
echo "Org ID: $BUFFER_ORGANIZATION_ID"
```

---

## Step 2: Get Your Profiles

Run this to see your connected social accounts:

```bash
curl -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d "{
    \"query\": \"query GetProfiles {\n      organization(id: \\\"$BUFFER_ORGANIZATION_ID\\\") {\n        profiles {\n          id\n          service\n          service_username\n          formatted_username\n        }\n      }\n    }\"
  }"
```

**You'll see:**
- `id` — Profile ID (need this for posting)
- `service` — twitter, linkedin, etc.
- `service_username` — @handle

---

## Step 3: Add Profile IDs to Env

After getting profile IDs, add to `.env.local`:

```bash
BUFFER_API_KEY=your_key
BUFFER_ORGANIZATION_ID=your_org_id
BUFFER_TWITTER_PROFILE_ID=profile_id_1
BUFFER_LINKEDIN_PROFILE_ID=profile_id_2
# etc...
```

---

## Step 4: Test Create Post

Create a test post to your first profile:

```bash
curl -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d "{
    \"query\": \"mutation CreatePost {\n      createPost(\n        profileId: \\\"$BUFFER_TWITTER_PROFILE_ID\\\"\n        text: \\\"Testing Buffer API from Al Does AI - Day 1 \\\"\n      ) {\n        id\n        text\n        status\n        scheduledAt\n      }\n    }\"
  }"
```

**Success response:**
```json
{
  "data": {
    "createPost": {
      "id": "post_id_here",
      "text": "Testing Buffer API from Al Does AI - Day 1",
      "status": "pending",
      "scheduledAt": null
    }
  }
}
```

---

## Step 5: Integration Scripts

Now I'll update the integration to use GraphQL.

### Create `scripts/buffer-graphql.js`:

```javascript
const BUFFER_API_KEY = process.env.BUFFER_API_KEY;
const BUFFER_ORG_ID = process.env.BUFFER_ORGANIZATION_ID;

async function getProfiles() {
  const query = `
    query GetProfiles {
      organization(id: "${BUFFER_ORG_ID}") {
        profiles {
          id
          service
          service_username
        }
      }
    }
  `;
  
  const response = await fetch('https://api.buffer.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BUFFER_API_KEY}`,
    },
    body: JSON.stringify({ query }),
  });
  
  return await response.json();
}

async function createPost(profileId, text) {
  const mutation = `
    mutation CreatePost {
      createPost(
        profileId: "${profileId}"
        text: "${text.replace(/"/g, '\\"')}"
      ) {
        id
        text
        status
        scheduledAt
      }
    }
  `;
  
  const response = await fetch('https://api.buffer.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BUFFER_API_KEY}`,
    },
    body: JSON.stringify({ query: mutation }),
  });
  
  return await response.json();
}

module.exports = { getProfiles, createPost };
```

### Test:
```bash
node -e "
const buffer = require('./scripts/buffer-graphql.js');
buffer.getProfiles().then(console.log);
"
```

---

## Step 6: Dashboard Integration

Update dashboard to use GraphQL version:
- Post to Buffer button → calls `createPost()`
- Show profile list from `getProfiles()`
- Display post status

---

## For Your Followers

**What to tell them:**

```markdown
## Buffer Setup (Updated March 2026)

Buffer uses GraphQL API.

1. Get API Key: https://publish.buffer.com/settings/api
2. Get Org ID:
   ```bash
   curl -X POST 'https://api.buffer.com' \
     -H 'Content-Type: application/json' \
     -H "Authorization: Bearer YOUR_KEY" \
     -d '{"query": "query { account { organizations { id } } }"}'
   ```
3. Get Profile IDs (see guide)
4. Add to `.env.local`:
   ```
   BUFFER_API_KEY=your_key
   BUFFER_ORGANIZATION_ID=your_org_id
   BUFFER_TWITTER_PROFILE_ID=profile_id
   ```
5. Test post

Full integration included in scripts/buffer-graphql.js
```

---

## Next Steps

1. ✅ You add API_KEY and ORGANIZATION_ID to `.env.local`
2. ✅ Run "Get Profiles" query above
3. ✅ Add profile IDs to `.env.local`
4. ✅ Run test post query
5. ⏳ I'll update `scripts/buffer-graphql.js` with full integration
6. ⏳ Update dashboard "Post to Buffer" button

**Ready to get your profile IDs?**