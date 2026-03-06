/**
 * Buffer GraphQL API - List Channels Example
 * 
 * This script fetches all connected social media channels for your organization.
 * You'll need the channel IDs for posting.
 * 
 * Prerequisites:
 * 1. BUFFER_API_KEY in .env.local
 * 2. BUFFER_ORGANIZATION_ID in .env.local
 * 3. Run: node 02-list-channels.js
 */

require('dotenv').config();

const BUFFER_API_KEY = process.env.BUFFER_API_KEY;
const BUFFER_ORGANIZATION_ID = process.env.BUFFER_ORGANIZATION_ID;

// Validate required environment variables
if (!BUFFER_API_KEY || !BUFFER_ORGANIZATION_ID) {
  console.error('❌ Missing required environment variables');
  console.error('   Create .env.local with:');
  console.error('   BUFFER_API_KEY=your_key');
  console.error('   BUFFER_ORGANIZATION_ID=your_org_id');
  process.exit(1);
}

/**
 * Make a GraphQL request to Buffer API
 */
async function graphqlRequest(query, variables = {}) {
  const response = await fetch('https://api.buffer.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BUFFER_API_KEY}`
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Get all connected channels for the organization
 * 
 * Note: Buffer uses 'channels' instead of 'profiles' as mentioned in some docs.
 * The query requires organizationId as an input parameter.
 */
async function getChannels() {
  const query = `
    query GetChannels($input: ChannelsInput!) {
      channels(input: $input) {
        id
        service
        displayName
        name
        externalLink
        isActive
      }
    }
  `;

  const variables = {
    input: {
      organizationId: BUFFER_ORGANIZATION_ID
    }
  };

  const result = await graphqlRequest(query, variables);

  if (result.errors) {
    throw new Error(`GraphQL Error: ${result.errors[0].message}`);
  }

  return result.data.channels;
}

/**
 * Get icon emoji for service
 */
function getServiceIcon(service) {
  const icons = {
    twitter: '🐦',
    instagram: '📸',
    tiktok: '🎵',
    linkedin: '💼',
    facebook: '👥',
    pinterest: '📌',
    mastodon: '🐘',
    google: '🔍'
  };
  return icons[service.toLowerCase()] || '📱';
}

/**
 * Main execution
 */
async function main() {
  console.log('📱 Buffer Channels List\n');
  console.log(`Organization ID: ${BUFFER_ORGANIZATION_ID.slice(0, 8)}...`);
  console.log('');

  try {
    const channels = await getChannels();

    if (channels.length === 0) {
      console.log('⚠️ No channels found for this organization');
      console.log('   Connect channels at: https://publish.buffer.com');
      return;
    }

    console.log(`✅ Found ${channels.length} channel(s):\n`);

    // Group by service type
    const grouped = channels.reduce((acc, channel) => {
      acc[channel.service] = acc[channel.service] || [];
      acc[channel.service].push(channel);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([service, serviceChannels]) => {
      console.log(`${getServiceIcon(service)} ${service.toUpperCase()} (${serviceChannels.length})`);
      console.log('─'.repeat(50));

      serviceChannels.forEach(channel => {
        console.log(`  Name:     ${channel.displayName || channel.name}`);
        console.log(`  ID:       ${channel.id}`);
        console.log(`  URL:      ${channel.externalLink || 'N/A'}`);
        console.log(`  Active:   ${channel.isActive ? '✅' : '❌'}`);
        console.log('');
      });
    });

    // Generate environment variable output
    console.log('\n➡️  Add these IDs to your .env.local:');
    channels.forEach(channel => {
      const envVar = `BUFFER_${channel.service.toUpperCase()}_PROFILE_ID=${channel.id}`;
      console.log(`   ${envVar}`);
    });

    // Generate JavaScript config
    console.log('\n➡️  Or use this in your JavaScript:');
    console.log('   const CHANNELS = {');
    channels.forEach((channel, i) => {
      const comma = i < channels.length - 1 ? ',' : '';
      console.log(`     ${channel.service}: '${channel.id}'${comma}`);
    });
    console.log('   };');

  } catch (error) {
    console.error('\n❌ Failed to fetch channels:');
    console.error('   ', error.message);
    console.error('\n   Troubleshooting:');
    console.error('   - Verify BUFFER_ORGANIZATION_ID is correct');
    console.error('   - Run 01-authentication.js to get your org ID');
    console.error('   - Ensure your account has connected channels');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { getChannels };
