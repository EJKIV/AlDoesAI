#!/bin/bash
# Alternative ways to get Buffer channels

source ~/.openclaw/workspace/projects/al-does-ai/.env.local

echo "=== Method 1: Get Channels from Account ==="
curl -s -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d '{
    "query": "query { account { channels { id service username } } }"
  }' | python3 -m json.tool

echo ""
echo "=== Method 2: Get Channels (direct query) ==="
curl -s -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d '{
    "query": "query { channels { id service username } }"
  }' | python3 -m json.tool

echo ""
echo "=== Method 3: List all available queries ==="
curl -s -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d '{
    "query": "{ __schema { queryType { fields { name type { name } } } } }"
  }' | python3 -m json.tool

echo ""
echo "=== Method 4: Search for 'channel' in schema ==="
curl -s -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d '{
    "query": "{ __schema { types { name fields { name } } } }"
  }' | grep -i channel | head -20
