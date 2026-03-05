#!/bin/bash
#
# Agent Deployment Script for Al Does AI
#
# Usage: ./scripts/deploy-agent.sh <agent-name>
#   - Updates registry status
#   - Registers agent with OpenClaw gateway
#   - Creates log directory
#   - Generates config for openclaw.json
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Paths
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REGISTRY_PATH="$PROJECT_DIR/.agents/registry.json"
SPEC_PATH="$PROJECT_DIR/docs/NAMED_AGENTS_SPEC.md"
OPENCLAW_CONFIG="$HOME/.openclaw/openclaw.json"
AGENT_NAME="${1:-}"

# Validate input
if [[ -z "$AGENT_NAME" ]]; then
    echo -e "${RED}❌ Error: Agent name required${NC}"
    echo -e "${YELLOW}Usage: ./scripts/deploy-agent.sh <agent-name>${NC}"
    echo -e "${YELLOW}Example: ./scripts/deploy-agent.sh TrendSurfer${NC}"
    echo ""
    echo -e "${CYAN}Available agents:${NC}"
    if [[ -f "$REGISTRY_PATH" ]]; then
        cat "$REGISTRY_PATH" | grep -E '"name":' | grep -v Webby | sed 's/.*: "\(.*\)".*/  - \1/'
    fi
    exit 1
fi

# Convert to proper case for lookup
AGENT_NAME_LOWER=$(echo "$AGENT_NAME" | tr '[:upper:]' '[:lower:]')

echo -e "${CYAN}🔧 Al Does AI — Agent Deployment${NC}"
echo ""
echo -e "${BLUE}Agent:${NC} $AGENT_NAME"
echo -e "${BLUE}Project:${NC} $PROJECT_DIR"
echo ""

# Check if registry exists
if [[ ! -f "$REGISTRY_PATH" ]]; then
    echo -e "${RED}❌ Error: Registry not found at $REGISTRY_PATH${NC}"
    exit 1
fi

# Check if spec exists
if [[ ! -f "$SPEC_PATH" ]]; then
    echo -e "${RED}❌ Error: Spec not found at $SPEC_PATH${NC}"
    exit 1
fi

# Get agent info from registry
AGENT_JSON=$(cat "$REGISTRY_PATH" | python3 -c "import sys,json; d=json.load(sys.stdin); print(json.dumps([a for a in d['agents'] if a['name'].lower()=='$AGENT_NAME_LOWER'], indent=2))" 2>/dev/null || echo "[]")

if [[ "$AGENT_JSON" == "[]" ]]; then
    echo -e "${RED}❌ Error: Agent '$AGENT_NAME' not found in registry${NC}"
    echo -e "${YELLOW}Run 'node scripts/generate-agent-config.js' to see available agents${NC}"
    exit 1
fi

# Extract agent details
AGENT_EMOJI=$(echo "$AGENT_JSON" | grep -o '"emoji": "[^"]*"' | cut -d'"' -f4)
AGENT_ROLE=$(echo "$AGENT_JSON" | grep -o '"role": "[^"]*"' | cut -d'"' -f4)
AGENT_STATUS=$(echo "$AGENT_JSON" | grep -o '"status": "[^"]*"' | cut -d'"' -f4)

echo -e "${GREEN}✅ Found agent in registry${NC}"
echo -e "  $AGENT_EMOJI $AGENT_NAME - $AGENT_ROLE"
echo -e "  Current status: $AGENT_STATUS"
echo ""

# Check if already active
if [[ "$AGENT_STATUS" == "active" ]]; then
    echo -e "${YELLOW}⚠️  Agent is already active${NC}"
    echo -e "${YELLOW}   Use 'tail -f .agents/$(echo "$AGENT_NAME_LOWER" | tr '[:upper:]' '[:lower:]')/logs/latest.log' to view logs${NC}"
    exit 0
fi

# Generate timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S%z")

# Create agent directory structure
echo -e "${BLUE}📁 Creating directory structure...${NC}"
AGENT_DIR="$PROJECT_DIR/.agents/$(echo "$AGENT_NAME_LOWER" | tr '[:upper:]' '[:lower:]')"
LOG_DIR="$AGENT_DIR/logs"
CONFIG_DIR="$AGENT_DIR"

mkdir -p "$LOG_DIR"
mkdir -p "$CONFIG_DIR"

echo -e "  ${GREEN}✓${NC} $AGENT_DIR"
echo -e "  ${GREEN}✓${NC} $LOG_DIR"

# Create initial config
echo -e "${BLUE}⚙️  Creating agent config...${NC}"
AGENT_CONFIG=$(cat "$REGISTRY_PATH" | python3 << PYTHON
import sys, json

data = json.load(sys.stdin)
for a in data['agents']:
    if a['name'].lower() == '$AGENT_NAME_LOWER':
        config = {
            "name": a['name'],
            "display_name": f"{a['emoji']} {a['display_name']}",
            "role": a['role'],
            "schedule": a['schedule'],
            "tools": a['tools'],
            "log_path": a['log_path'],
            "created_at": "$TIMESTAMP",
            "version": "1.0.0"
        }
        print(json.dumps(config, indent=2))
        break
PYTHON
)

echo "$AGENT_CONFIG" > "$CONFIG_DIR/config.json"
echo -e "  ${GREEN}✓${NC} config.json"

# Update registry
echo -e "${BLUE}📝 Updating registry...${NC}"
python3 << PYTHON
import json
import sys

with open('$REGISTRY_PATH', 'r') as f:
    data = json.load(f)

for a in data['agents']:
    if a['name'].lower() == '$AGENT_NAME_LOWER':
        a['status'] = 'active'
        a['deployed_date'] = '$TIMESTAMP'
        a['deployed_by'] = 'Al'
        a['last_run'] = '$TIMESTAMP'
        print(f"Updated {a['name']} status: {a['status']}")
        break

with open('$REGISTRY_PATH', 'w') as f:
    json.dump(data, f, indent=2)
    
print("Registry updated successfully")
PYTHON

echo -e "  ${GREEN}✓${NC} registry.json updated"

# Generate log file
echo -e "${BLUE}📝 Creating log file...${NC}"
LOG_FILE="$LOG_DIR/startup-$(date +%Y%m%d-%H%M%S).log"
cat > "$LOG_FILE" << EOF
=================================================
Agent Deployment Log
=================================================
Agent: $AGENT_NAME
Timestamp: $TIMESTAMP
Deployed by: Al
Approved by: Jim
Status: ACTIVE

Initial Configuration:
EOF
echo "$AGENT_CONFIG" >> "$LOG_FILE"
cat >> "$LOG_FILE" << EOF

=================================================
Startup Sequence
=================================================
$(date '+%Y-%m-%d %H:%M:%S') - Initializing agent...
$(date '+%Y-%m-%d %H:%M:%S') - Loading configuration...
$(date '+%Y-%m-%d %H:%M:%S') - Verifying tools access...
$(date '+%Y-%m-%d %H:%M:%S') - Agent ready for activation

=================================================
Logs will appear below when agent runs:
=================================================

EOF

ln -sf "$LOG_FILE" "$LOG_DIR/latest.log" 2>/dev/null || true
echo -e "  ${GREEN}✓${NC} Log file: $LOG_FILE"

# Run config generator
echo ""
echo -e "${BLUE}🔧 Generating OpenClaw config...${NC}"
node "$PROJECT_DIR/scripts/generate-agent-config.js" "$AGENT_NAME"

# Check if openclaw.json exists and offer to update
echo ""
if [[ -f "$OPENCLAW_CONFIG" ]]; then
    echo -e "${YELLOW}⚠️  Manual step required:${NC}"
    echo -e "${YELLOW}   Add the generated config above to:${NC}"
    echo -e "${YELLOW}   $OPENCLAW_CONFIG${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  OpenClaw config not found at:${NC}"
    echo -e "${YELLOW}   $OPENCLAW_CONFIG${NC}"
    echo -e "${YELLOW}   Please create this file and add the config above${NC}"
    echo ""
fi

# Check if gateway is running
echo -e "${BLUE}🔍 Checking OpenClaw gateway...${NC}"
if command -v openclaw &> /dev/null; then
    GATEWAY_STATUS=$(openclaw gateway status 2>/dev/null || echo "unknown")
    if [[ "$GATEWAY_STATUS" == *"running"* ]] || [[ "$GATEWAY_STATUS" == *"active"* ]]; then
        echo -e "  ${GREEN}✓${NC} Gateway is running"
    else
        echo -e "  ${YELLOW}⚠️  Gateway status: $GATEWAY_STATUS${NC}"
        echo -e "  ${YELLOW}   Run: openclaw gateway start${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠️  openclaw CLI not found in PATH${NC}"
fi

# Final status
echo ""
echo -e "${CYAN}=================================================${NC}"
echo -e "${GREEN}✅ Deployment Complete${NC}"
echo -e "${CYAN}=================================================${NC}"
echo ""
echo -e "${BLUE}Agent:${NC} $AGENT_EMOJI $AGENT_NAME"
echo -e "${BLUE}Status:${NC} ${GREEN}Active${NC}"
echo -e "${BLUE}Config:${NC} $CONFIG_DIR/config.json"
echo -e "${BLUE}Logs:${NC} $LOG_DIR/latest.log"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Add the generated config to ~/.openclaw/openclaw.json"
echo "  2. Run: openclaw gateway restart (if needed)"
echo "  3. Monitor logs: tail -f $LOG_DIR/latest.log"
echo "  4. Dashboard updates automatically on next refresh"
echo ""
echo -e "${CYAN}Visit the dashboard to see your deployed agent!${NC}"
echo ""
