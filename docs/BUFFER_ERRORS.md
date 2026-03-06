# Buffer GraphQL API - Error Troubleshooting Guide

**Last Updated:** March 2026  
**Scope:** Buffer GraphQL API at `https://api.buffer.com`

---

## Quick Diagnosis Table

| Error Message | Likely Cause | Quick Fix |
|---------------|--------------|-----------|
| `Cannot query field "profiles" on type "Organization"` | Using deprecated REST terminology | Use `channels(input: {...})` query instead |
| `Profile not found` | Invalid or changed channel ID | Re-run channel list query to get updated IDs |
| `Text too long` | Exceeds platform limit | Truncate or split into thread |
| `Invalid authentication` | Revoked/expired API key | Generate new key at buffer.com/settings/api |
| `Rate limit exceeded` | Too many requests | Wait 60s and retry with exponential backoff |
| `Unauthorized` | Missing/corrupt API key | Check .env.local file formatting |
| `Organization not found` | Wrong org ID | Verify with account query |
| `Cannot read property 'channels' of undefined` | Missing organizationId input | Add `input: {organizationId: "..."}` |

---

## Authentication Errors

### `UNAUTHORIZED` / `Invalid authentication`

**Symptoms:**
- All requests return 401 or error about authentication
- Organization query returns empty or fails

**Causes & Fixes:**

1. **API Key Not Set**
   ```bash
   # Check if environment variable exists
   echo $BUFFER_API_KEY
   
   # If empty, add to .env.local:
   BUFFER_API_KEY=your_actual_key_here
   ```

2. **Key Revoked or Expired**
   - Go to https://publish.buffer.com/settings/api
   - Verify key status
   - If expired, generate new key
   - Update .env.local with new key

3. **Header Format Error**
   ```javascript
   // ❌ Wrong
   headers: { 'Authorization': BUFFER_API_KEY }
   
   // ✅ Correct
   headers: { 'Authorization': `Bearer ${BUFFER_API_KEY}` }
   ```

4. **Key Copied Incorrectly**
   - Ensure no extra spaces or newlines
   - Key should match exactly from Buffer settings
   - Try regenerating and copying again

---

## Schema/Field Errors

### `Cannot query field "profiles" on type "Organization"`

**The Issue:** Buffer's documentation references a `profiles` field that doesn't exist in the actual GraphQL schema.

**The Fix:**
```graphql
# ❌ Wrong (from old docs)
query {
  organization(id: "...") {
    profiles { id }
  }
}

# ✅ Correct (discovered via introspection)
query {
  channels(input: {organizationId: "..."}) {
    id
    service
    displayName
  }
}
```

### `Field "channels" argument "input" of type "ChannelsInput!" is required`

**The Issue:** Missing required input parameter for the channels query.

**The Fix:**
```javascript
// ❌ Wrong
query: `{ channels { id } }`

// ✅ Correct
query: `
  query GetChannels($input: ChannelsInput!) {
    channels(input: $input) {
      id
      service
    }
  }
`,
variables: {
  input: { organizationId: "..." }
}
```

### `Cannot query field "username" on type "Channel"`

**The Issue:** Field name is different than expected.

**The Fix:**
```graphql
# ❌ Wrong
channels { id username }

# ✅ Correct - use one of these:
channels { id displayName }  # Shows @handle
channels { id name }         # Shows internal name
```

---

## Channel/Profile Errors

### `PROFILE_NOT_FOUND` / `Channel not found`

**Symptoms:**
- Post creation fails with profile/channel not found
- Was working previously but stopped

**Causes & Fixes:**

1. **Channel Disconnected**
   - Someone removed the channel from Buffer dashboard
   - Go to https://publish.buffer.com → reconnect channel
   - Re-fetch channel IDs with 02-list-channels.js

2. **Wrong ID Format**
   - Channel IDs are 24-character hex strings
   - Example: `69aa063e3f3b94a1211d9636`
   - Verify no typos, missing characters, or extra spaces

3. **ID Reassigned**
   - Reconnecting a channel generates a new ID
   - Always refresh channel list after reconnecting

4. **Wrong Platform Selected**
   - Ensure you're posting Twitter ID to Twitter, not Instagram
   - Cross-check service field in channel list

**Debug Command:**
```bash
node scripts/buffer-examples/02-list-channels.js
# Verify the ID matches what you're using
```

### `No channels found for this organization`

**Causes:**
1. Wrong organization ID
2. Account has no connected channels
3. Organization was deleted

**Fixes:**
1. Verify organization ID:
   ```bash
   node scripts/buffer-examples/01-authentication.js
   ```
2. Connect channels at https://publish.buffer.com
3. Check you're using the right organization (some accounts have multiple)

---

## Content Errors

### `TEXT_TOO_LONG`

**Platform Limits:**
| Platform | Max Characters |
|----------|---------------|
| Twitter | 280 (or 4,000 for Blue) |
| Instagram | 2,200 |
| TikTok | 2,200 |
| LinkedIn | 3,000 |
| Facebook | 5,000 |

**Fixes:**

1. **Truncate with ellipsis:**
   ```javascript
   function truncate(text, limit = 277) {
     if (text.length <= limit) return text;
     return text.substring(0, limit - 3) + '...';
   }
   ```

2. **Convert to Twitter thread:**
   Split long content into multiple connected tweets

3. **Use link shorteners:**
   - URLs count toward limit
   - Buffer auto-shortens but counts original length
   - Pre-shorten with bit.ly or similar

### `INVALID_SCHEDULED_TIME`

**Causes:**
- Time in the past
- Time too far in future (Buffer has limits)
- Malformed ISO 8601 string

**Fix:**
```javascript
// ✅ Valid: 10 minutes from now
const scheduledAt = new Date(Date.now() + 10 * 60000).toISOString();

// ✅ Valid: Specific future time
const scheduledAt = "2026-03-10T14:00:00Z"; // Must be UTC

// ❌ Invalid: Time in past
const scheduledAt = "2025-01-01T00:00:00Z"; 

// ❌ Invalid: Local time without timezone
const scheduledAt = "2026-03-10 14:00:00"; 
```

---

## Rate Limiting Errors

### `RATE_LIMITED`

**Limits (empirically determined):**
- 50 write operations per minute
- 100 read operations per minute
- May vary by plan tier

**Response Headers:**
```
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1709836800
```

**Fixes:**

1. **Implement backoff:**
   ```javascript
   async function withRetry(fn, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (error.code !== 'RATE_LIMITED') throw error;
         const delay = Math.pow(2, i) * 1000;
         await new Promise(r => setTimeout(r, delay));
       }
     }
   }
   ```

2. **Add delays between requests:**
   ```javascript
   for (const post of posts) {
     await createPost(post);
     await new Promise(r => setTimeout(r, 2000)); // 2s delay
   }
   ```

3. **Batch operations carefully:**
   Don't fire all requests at once

---

## Network/Connection Errors

### `FetchError` or `Network request failed`

**Causes:**
1. No internet connection
2. Buffer API downtime
3. DNS resolution failure
4. Corporate firewall blocking requests

**Diagnosis:**
```bash
# Test basic connectivity
curl -I https://api.buffer.com

# Test with DNS resolution
dig api.buffer.com

# Check if API is up (should return HTTP 200 or 400)
curl -X POST https://api.buffer.com \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __typename }"}'
```

**Fixes:**

1. **Check API status:**
   - Visit https://status.buffer.com
   - Check Buffer's Twitter for outages

2. **Verify DNS:**
   ```bash
   # Add to /etc/hosts if needed (temporary fix)
   104.16.86.23 api.buffer.com
   ```

3. **Handle gracefully:**
   ```javascript
   try {
     await createPost(text);
   } catch (error) {
     if (error.name === 'FetchError') {
       console.log('Network error, will retry later');
       queueForRetry(text);
     }
   }
   ```

---

## Common Environment Setup Errors

### `.env.local` Not Loading

**Symptoms:**
- `process.env.BUFFER_API_KEY` is undefined
- Scripts exit with "API key not found"

**Fixes:**

1. **Verify file location:**
   ```
   .env.local  ✅ (project root)
   .env        ✅ (alternative name)
   env.local   ❌ (no dot)
   ```

2. **Check file encoding:**
   - Must be UTF-8
   - No BOM (Byte Order Mark)
   - Unix line endings (LF not CRLF)

3. **Verify dotenv is loaded:**
   ```javascript
   // At top of file
   require('dotenv').config();
   
   // Check path if needed
   require('dotenv').config({ path: './.env.local' });
   ```

4. **Check gitignore:**
   ```
   # Verify .env.local is in .gitignore
   .env.local
   .env
   ```

---

## Debugging Commands

### Full Diagnostic Script
```bash
#!/bin/bash

echo "=== Buffer API Diagnostic ==="
echo ""

# 1. Check environment variables
echo "1. Environment Variables:"
echo "   BUFFER_API_KEY: ${BUFFER_API_KEY:+✅ Set} ${BUFFER_API_KEY:-❌ Missing}"
echo "   BUFFER_ORGANIZATION_ID: ${BUFFER_ORGANIZATION_ID:+✅ Set} ${BUFFER_ORGANIZATION_ID:-❌ Missing}"
echo ""

# 2. Test authentication
echo "2. Authentication Test:"
AUTH_RESULT=$(curl -s -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d '{"query": "query { account { organizations { id } } }"}' 2>/dev/null)

if echo "$AUTH_RESULT" | grep -q '"data"'; then
  echo "   ✅ Authentication successful"
else
  echo "   ❌ Authentication failed"
  echo "   Response: $AUTH_RESULT"
fi
echo ""

# 3. List channels
echo "3. Channel Retrieval:"
CHANNEL_RESULT=$(curl -s -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d "{\"query\": \"query { channels(input: {organizationId: \\\"$BUFFER_ORGANIZATION_ID\\\"}) { id service } }\"}" 2>/dev/null)

CHANNEL_COUNT=$(echo "$CHANNEL_RESULT" | grep -o '"id"' | wc -l)
echo "   Channels found: $CHANNEL_COUNT"
echo ""

echo "=== Diagnostic Complete ==="
```

### Enable Debug Mode
```bash
# Run scripts with debug output
DEBUG=1 node 03-create-post.js twitter "Test"

# Or in Node.js
process.env.DEBUG = '1';
```

---

## Getting Help

If you're still stuck:

1. **Buffer Support:**
   - Email: support@buffer.com
   - Include your error message and code sample

2. **Community:**
   - Buffer Developers Facebook Group
   - Reddit r/buffer

3. **Check Documentation:**
   - https://developers.buffer.com
   - Note: Docs may not reflect current GraphQL schema

4. **Use Introspection:**
   ```graphql
   {
     __schema {
       types {
         name
         fields { name type { name } }
       }
     }
   }
   ```

---

## Error Code Reference

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Invalid or missing API key |
| `PROFILE_NOT_FOUND` | Channel ID doesn't exist |
| `TEXT_TOO_LONG` | Exceeds platform character limit |
| `INVALID_SCHEDULED_TIME` | Scheduled time invalid |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Buffer server error |
| `GRAPHQL_PARSE_FAILED` | Malformed GraphQL query |
| `GRAPHQL_VALIDATION_FAILED` | Invalid query structure |

---

*This guide reflects actual findings from real-world Buffer GraphQL API integration.*
