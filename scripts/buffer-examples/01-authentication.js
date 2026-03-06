/**
 * Buffer GraphQL API - Authentication Example
 * 
 * This script demonstrates how to authenticate with Buffer's GraphQL API
 * and retrieve your organization ID.
 * 
 * Setup:
 * 1. Get API key from: https://publish.buffer.com/settings/api
 * 2. Save to .env.local: BUFFER_API_KEY=your_key_here
 * 3. Run: node 01-authentication.js
 */

require('dotenv').config();

const BUFFER_API_URL = 'https://api.buffer.com';
const BUFFER_API_KEY = process.env.BUFFER_API_KEY;

// Validate API key is set
if (!BUFFER_API_KEY) {
  console.error('❌ BUFFER_API_KEY not found in environment');
  console.error('   Create .env.local with: BUFFER_API_KEY=your_key_here');
  process.exit(1);
}

/**
 * Make a GraphQL request to Buffer API
 */
async function graphqlRequest(query, variables = {}) {
  const response = await fetch(BUFFER_API_URL, {
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
 * Get organizations associated with this account
 */
async function getOrganizations() {
  const query = `
    query GetOrganizations {
      account {
        organizations {
          id
          name
          createdAt
        }
      }
    }
  `;

  const result = await graphqlRequest(query);

  if (result.errors) {
    throw new Error(`GraphQL Error: ${result.errors[0].message}`);
  }

  return result.data.account.organizations;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔐 Buffer GraphQL Authentication Test\n');
  console.log('API URL:', BUFFER_API_URL);
  console.log('API Key:', BUFFER_API_KEY.slice(0, 4) + '...' + BUFFER_API_KEY.slice(-4));
  console.log('');

  try {
    console.log('Fetching organizations...\n');
    const organizations = await getOrganizations();

    if (organizations.length === 0) {
      console.log('⚠️ No organizations found for this account');
      return;
    }

    console.log(`✅ Found ${organizations.length} organization(s):\n`);

    organizations.forEach((org, index) => {
      console.log(`  ${index + 1}. ${org.name}`);
      console.log(`     ID: ${org.id}`);
      console.log(`     Created: ${org.createdAt}`);
      console.log('');
    });

    console.log('➡️  Add to your .env.local:');
    console.log(`   BUFFER_ORGANIZATION_ID=${organizations[0].id}`);

  } catch (error) {
    console.error('\n❌ Authentication failed:');
    console.error('   ', error.message);
    console.error('\n   Troubleshooting:');
    console.error('   - Verify your API key at https://publish.buffer.com/settings/api');
    console.error('   - Ensure the key has not expired');
    console.error('   - Check that the key is correctly copied');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { graphqlRequest, getOrganizations };
