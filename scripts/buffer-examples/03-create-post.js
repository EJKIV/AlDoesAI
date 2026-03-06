/**
 * Buffer GraphQL API - Create Post Example
 * 
 * Creates a post on a specified social media channel.
 * 
 * Prerequisites:
 * 1. BUFFER_API_KEY in .env.local
 * 2. BUFFER_*_PROFILE_ID in .env.local
 * 
 * Usage:
 *   node 03-create-post.js twitter "Hello from Buffer API!"
 *   node 03-create-post.js instagram "Check out our latest update"
 */

require('dotenv').config();

const BUFFER_API_KEY = process.env.BUFFER_API_KEY;

// Channel IDs from environment
const CHANNELS = {
  twitter: process.env.BUFFER_TWITTER_PROFILE_ID,
  instagram: process.env.BUFFER_INSTAGRAM_PROFILE_ID,
  tiktok: process.env.BUFFER_TIKTOK_PROFILE_ID,
  linkedin: process.env.BUFFER_LINKEDIN_PROFILE_ID,
  facebook: process.env.BUFFER_FACEBOOK_PROFILE_ID
};

// Platform-specific character limits
const LIMITS = {
  twitter: 280,
  instagram: 2200,
  tiktok: 2200,
  linkedin: 3000,
  facebook: 5000
};

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
 * Create a post on a specific channel
 * 
 * @param {string} profileId - The channel ID to post to
 * @param {string} text - Post content
 * @param {object} options - Optional scheduling options
 * @returns {object} Created post details
 */
async function createPost(profileId, text, options = {}) {
  // Build mutation with optional parameters
  let mutationFields = `
    id
    text
    status
    scheduledAt
  `;

  let args = [
    `profileId: "${profileId}"`,
    `text: "${text.replace(/"/g, '\\"')}"`
  ];

  if (options.scheduledAt) {
    args.push(`scheduledAt: "${options.scheduledAt}"`);
  }

  const mutation = `
    mutation CreatePost {
      createPost(
        ${args.join('\n        ')}
      ) {
        ${mutationFields}
      }
    }
  `;

  const result = await graphqlRequest(mutation);

  if (result.errors) {
    const error = result.errors[0];
    throw new Error(`${error.extensions?.code || 'ERROR'}: ${error.message}`);
  }

  return result.data.createPost;
}

/**
 * Validate text for platform-specific limits
 */
function validateText(platform, text) {
  const limit = LIMITS[platform];
  
  if (!limit) {
    console.warn(`⚠️ Unknown platform "${platform}" - no limit validation`);
    return { valid: true };
  }

  if (text.length > limit) {
    return {
      valid: false,
      error: `Text exceeds ${platform} limit (${text.length}/${limit} characters)`
    };
  }

  return { valid: true };
}

/**
 * Format scheduled time
 */
function formatScheduledTime(hoursFromNow) {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow);
  return date.toISOString();
}

/**
 * Main execution with CLI arguments
 */
async function main() {
  // Parse arguments
  const platform = process.argv[2];
  const text = process.argv.slice(3).join(' ');

  // Show help if no args
  if (!platform || platform === '--help' || platform === '-h') {
    console.log('🚀 Buffer Create Post\n');
    console.log('Usage:');
    console.log('  node 03-create-post.js <platform> "Your post text here"');
    console.log('');
    console.log('Platforms:');
    Object.keys(CHANNELS).forEach(p => {
      const configured = CHANNELS[p] ? '✅' : '❌';
      console.log(`  ${configured} ${p} (limit: ${LIMITS[p] || '?'} chars)`);
    });
    console.log('');
    console.log('Examples:');
    console.log('  node 03-create-post.js twitter "Hello world!"');
    console.log('  node 03-create-post.js instagram "📸 New post"');
    process.exit(0);
  }

  // Validate platform
  const profileId = CHANNELS[platform];
  if (!profileId) {
    console.error(`❌ Platform "${platform}" not configured`);
    console.error(`   Add BUFFER_${platform.toUpperCase()}_PROFILE_ID to .env.local`);
    console.error(`   Run 02-list-channels.js to get channel IDs`);
    process.exit(1);
  }

  // Validate text
  if (!text) {
    console.error('❌ No post text provided');
    console.error('   Usage: node 03-create-post.js twitter "Your text here"');
    process.exit(1);
  }

  const validation = validateText(platform, text);
  if (!validation.valid) {
    console.error(`❌ ${validation.error}`);
    process.exit(1);
  }

  // Show preview
  console.log('📝 Post Preview\n');
  console.log(`Platform: ${platform}`);
  console.log(`Length:   ${text.length} characters`);
  console.log(`Text:`);
  console.log(`  "${text}"`);
  console.log('');

  // Create post
  try {
    console.log('Creating post...\n');
    
    const post = await createPost(profileId, text);

    console.log('✅ Post created successfully!\n');
    console.log(`Post ID:      ${post.id}`);
    console.log(`Status:       ${post.status}`);
    
    if (post.scheduledAt) {
      console.log(`Scheduled:    ${new Date(post.scheduledAt).toLocaleString()}`);
    } else {
      console.log(`Queue:        Added to default queue`);
    }

    console.log('\n📊 Next steps:');
    console.log('   - Check Buffer dashboard: https://publish.buffer.com');
    console.log('   - Post will be published according to your schedule');
    console.log(`   - Run 04-post-status.js ${post.id} to check status`);

    return post;

  } catch (error) {
    console.error('\n❌ Failed to create post:');
    console.error('   ', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createPost, validateText, CHANNELS };
