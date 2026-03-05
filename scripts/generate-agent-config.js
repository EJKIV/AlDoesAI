#!/usr/bin/env node
/**
 * Generate Agent Config for openclaw.json
 * 
 * Reads from docs/NAMED_AGENTS_SPEC.md and generates
 * configuration entries for each approved agent.
 * 
 * Usage: node scripts/generate-agent-config.js [agent-name]
 *   - No args: generates config for all approved agents
 *   - With arg: generates config for specific agent
 */

const fs = require('fs');
const path = require('path');

const SPEC_PATH = path.join(__dirname, '..', 'docs', 'NAMED_AGENTS_SPEC.md');
const REGISTRY_PATH = path.join(__dirname, '..', '.agents', 'registry.json');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Parse agent specifications from markdown
 */
function parseAgentSpecs(content) {
  const agents = [];
  const sections = content.split(/^## \d+\. /m);
  
  for (const section of sections) {
    if (!section.trim() || !section.includes('**Name:**')) continue;
    
    const agent = {};
    
    // Extract name
    const nameMatch = section.match(/\*\*Name:\*\*\s*(.+?)(?:\n|$)/);
    if (nameMatch) agent.name = nameMatch[1].trim();
    
    // Extract emoji
    const emojiMatch = section.match(/\*\*Emoji:\*\*\s*(.+?)(?:\n|$)/);
    if (emojiMatch) agent.emoji = emojiMatch[1].trim();
    
    // Extract role
    const roleMatch = section.match(/\*\*Tagline:\*\*\s*"?(.+?)"?(?:\n|$)/);
    if (roleMatch) agent.tagline = roleMatch[1].trim();
    
    // Extract tools from code block
    const toolsMatch = section.match(/```json\s*{\s*"tools":\s*(\[.*?\])/s);
    if (toolsMatch) {
      try {
        agent.tools = JSON.parse(toolsMatch[1].replace(/\n\s*/g, ''));
      } catch (e) {
        agent.tools = [];
      }
    }
    
    // Extract schedule
    const scheduleMatch = section.match(/"schedule":\s*"([^"]+)"/);
    if (scheduleMatch) agent.schedule = scheduleMatch[1];
    
    // Extract timeout
    const timeoutMatch = section.match(/"timeout":\s*"([^"]+)"/);
    if (timeoutMatch) agent.timeout = timeoutMatch[1];
    
    // Extract purpose
    const purposeMatch = section.match(/### Purpose\s*\n([^#]+)/);
    if (purposeMatch) agent.purpose = purposeMatch[1].trim();
    
    // Extract owner
    const ownerMatch = section.match(/\*\*Owner:\*\*\s*(.+?)(?:\n|$)/);
    if (ownerMatch) agent.owner = ownerMatch[1].trim();
    
    if (agent.name) {
      agents.push(agent);
    }
  }
  
  return agents;
}

/**
 * Load registry data
 */
function loadRegistry() {
  try {
    const content = fs.readFileSync(REGISTRY_PATH, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    log(`Warning: Could not load registry: ${e.message}`, 'yellow');
    return { agents: [] };
  }
}

/**
 * Generate openclaw.json config for an agent
 */
function generateAgentConfig(agent, registryData) {
  const registryEntry = registryData.agents.find(a => a.name === agent.name);
  
  // Convert tools array to permissions format
  const permissions = {
    web_search: agent.tools?.includes('web_search') || false,
    web_fetch: agent.tools?.includes('web_fetch') || false,
    read: agent.tools?.includes('read') || true,  // default true
    write: agent.tools?.includes('write') || true, // default true
    edit: agent.tools?.includes('edit') || false,
    exec_curl: agent.tools?.includes('exec:curl') || agent.tools?.includes('exec') || false,
    message: agent.tools?.includes('message') || false
  };
  
  // Parse schedule to cron format
  let cronExpression = agent.schedule || '0 */6 * * *';
  
  // Generate config
  const config = {
    name: agent.name,
    display_name: `${agent.emoji} ${agent.name}`,
    description: agent.purpose || `${agent.role || agent.tagline}`,
    permissions: permissions,
    cron: registryEntry?.status === 'active' ? cronExpression : null,
    timeout: agent.timeout || '10m',
    registry: {
      status: registryEntry?.status || 'pending',
      approved_by: registryEntry?.approved_by || null,
      deployed_by: registryEntry?.deployed_by || null,
      approved_date: registryEntry?.approved_date || null,
      deployed_date: registryEntry?.deployed_date || null
    }
  };
  
  return config;
}

/**
 * Print config in openclaw.json format
 */
function printOpenClawConfig(configs) {
  const output = {
    agents: configs.reduce((acc, config) => {
      acc[config.name] = {
        display_name: config.display_name,
        description: config.description,
        permissions: config.permissions,
        cron: config.cron,
        timeout: config.timeout
      };
      return acc;
    }, {})
  };
  
  log('\n=== openclaw.json Configuration ===\n', 'cyan');
  console.log(JSON.stringify(output, null, 2));
  log('\n=== End Configuration ===\n', 'cyan');
}

/**
 * Generate config snippet for openclaw.json
 */
function printConfigSnippet(configs) {
  log('\n// Add this to ~/.openclaw/openclaw.json under "agents":\n', 'cyan');
  
  configs.forEach(config => {
    log(`"${config.name}": {`, 'green');
    log(`  "display_name": "${config.display_name}",`, 'green');
    log(`  "description": "${config.description}",`, 'green');
    log(`  "permissions": ${JSON.stringify(config.permissions, null, 2).replace(/\n/g, '\n  ')},`, 'green');
    log(`  "cron": "${config.cron}",`, 'green');
    log(`  "timeout": "${config.timeout}"`, 'green');
    log('},', 'green');
  });
  
  log('\n// End snippet\n', 'cyan');
}

/**
 * Main function
 */
function main() {
  const targetAgent = process.argv[2];
  
  log('🔧 Al Does AI — Agent Config Generator\n', 'cyan');
  
  // Read spec file
  let specContent;
  try {
    specContent = fs.readFileSync(SPEC_PATH, 'utf8');
    log(`✅ Loaded spec from ${SPEC_PATH}`, 'green');
  } catch (e) {
    log(`❌ Error reading spec file: ${e.message}`, 'red');
    process.exit(1);
  }
  
  // Parse agents from spec
  const agents = parseAgentSpecs(specContent);
  log(`✅ Found ${agents.length} agents in spec`, 'green');
  
  // Load registry
  const registry = loadRegistry();
  
  // Filter agents if target specified
  const targetAgents = targetAgent 
    ? agents.filter(a => a.name.toLowerCase() === targetAgent.toLowerCase())
    : agents;
  
  if (targetAgent && targetAgents.length === 0) {
    log(`❌ Agent "${targetAgent}" not found in spec`, 'red');
    log(`Available agents: ${agents.map(a => a.name).join(', ')}`, 'yellow');
    process.exit(1);
  }
  
  // Generate configs
  const configs = targetAgents.map(agent => {
    const config = generateAgentConfig(agent, registry);
    
    const registryEntry = registry.agents.find(a => a.name === agent.name);
    const status = registryEntry?.status || 'pending';
    const statusColor = status === 'active' ? 'green' : status === 'approved' ? 'yellow' : 'reset';
    
    log(`\n  ${agent.emoji} ${agent.name}`, 'cyan');
    log(`     Status: ${status}`, statusColor);
    log(`     Schedule: ${config.cron || 'manual'}`, 'reset');
    log(`     Tools: ${config.permissions ? Object.keys(config.permissions).filter(k => config.permissions[k]).join(', ') : 'none'}`, 'reset');
    
    return config;
  });
  
  // Print full config
  printOpenClawConfig(configs);
  
  // Print snippet
  printConfigSnippet(configs);
  
  // Save to temp file
  const tempPath = path.join(__dirname, 'agent-config-output.json');
  fs.writeFileSync(tempPath, JSON.stringify({ agents: configs }, null, 2));
  log(`✅ Config saved to ${tempPath}`, 'green');
  
  log('\n💡 Next steps:', 'cyan');
  log('   1. Review the generated config above', 'reset');
  log('   2. Copy the snippet to ~/.openclaw/openclaw.json', 'reset');
  log('   3. Run: ./scripts/deploy-agent.sh <agent-name>', 'reset');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { parseAgentSpecs, generateAgentConfig };
