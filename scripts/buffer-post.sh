#!/bin/bash
# buffer-post.sh - Post to Buffer via GraphQL API

source ~/.openclaw/workspace/projects/al-does-ai/.env.local

# Usage: ./buffer-post.sh [twitter|tiktok|instagram] "Your post text"

PLATFORM=$1
TEXT=$2

case $PLATFORM in
  twitter)
    PROFILE_ID=$BUFFER_TWITTER_PROFILE_ID
    ;;
  tiktok)
    PROFILE_ID=$BUFFER_TIKTOK_PROFILE_ID
    ;;
  instagram)
    PROFILE_ID=$BUFFER_INSTAGRAM_PROFILE_ID
    ;;
  *)
    echo "Usage: ./buffer-post.sh [twitter|tiktok|instagram] \"Your post text\""
    exit 1
    ;;
esac

echo "Posting to $PLATFORM..."

# Note: Buffer's createPost mutation might vary
# This is a template - may need adjustment based on actual schema
curl -s -X POST 'https://api.buffer.com' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BUFFER_API_KEY" \
  -d "{
    \"query\": \"mutation CreatePost {\n      createPost(\n        channelId: \\\"$PROFILE_ID\\\"\n        text: \\\"$TEXT\\\"\n      ) {\n        id\n        status\n        text\n      }\n    }\"
  }" | python3 -m json.tool
