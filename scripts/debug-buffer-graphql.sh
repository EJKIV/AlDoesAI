#!/bin/bash
# debug-buffer-graphql.sh - Find available fields

source ~/.openclaw/workspace/projects/al-does-ai/.env.local

echo "=== Getting Organizations ==="
curl -s -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d '{
    "query": "query { account { organizations { id name } } }"
  }' | python3 -m json.tool

echo ""
echo "=== Introspecting Organization type ==="
curl -s -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d '{
    "query": "{
      __type(name: \"Organization\") {
        fields {
          name
          type { name }
        }
      }
    }"
  }' | python3 -m json.tool

echo ""
echo "=== Trying common profile/channel queries ==="

# Try channels array
echo "Trying 'channels'..."
curl -s -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d "{
    \"query\": \"query {\n      organization(id: \\\"$BUFFER_ORGANIZATION_ID\\\") {\n        channels {\n          id\n          service\n          username\n        }\n      }\n    }\"
  }" | python3 -m json.tool

echo ""
echo "Trying 'accounts'..."
curl -s -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d "{
    \"query\": \"query {\n      organization(id: \\\"$BUFFER_ORGANIZATION_ID\\\") {\n        accounts {\n          id\n          service\n          username\n        }\n      }\n    }\"
  }" | python3 -m json.tool

echo ""
echo "Trying 'profiles' with correct casing..."
curl -s -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d "{
    \"query\": \"query {\n      organization(id: \\\"$BUFFER_ORGANIZATION_ID\\\") {\n        Profiles {\n          id\n          service\n          username\n        }\n      }\n    }\"
  }" | python3 -m json.tool
