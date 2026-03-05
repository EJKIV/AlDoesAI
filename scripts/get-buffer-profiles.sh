#!/bin/bash
# get-buffer-profiles.sh - Fetch your Buffer profiles

source ~/.openclaw/workspace/projects/al-does-ai/.env.local

echo "Fetching Buffer profiles..."

# Try alternative query - might be 'channels' instead of 'profiles'
curl -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d '{
    "query": "query { organization(id: \""$BUFFER_ORGANIZATION_ID"\") { channels { id service username } } }"
  }'

echo ""
echo ""
echo "If that doesn't work, trying 'accounts'..."

# Try accounts
curl -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d '{
    "query": "query { organization(id: \""$BUFFER_ORGANIZATION_ID"\") { accounts { id service username } } }"
  }'

echo ""
echo ""
echo "Trying full introspection..."

# Try to introspect available fields
curl -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d '{
    "query": "{
      __type(name: \"Organization\") {
        name
        fields {
          name
          type {
            name
          }
        }
      }
    }"
  }' | python3 -m json.tool
