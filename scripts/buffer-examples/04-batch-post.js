/**
 * Buffer GraphQL API - Batch Post Example
 * 
 * Creates posts on multiple channels simultaneously.
 * Useful for cross-platform content distribution.
 * 
 * Usage:
 *   node 04-batch-post.js "Your post text here"
 *   PLATFORMS=twitter,instagram node 04-batch-post.js "Hello world"
 */

require('dotenv').config();

const BUFFER_API_KEY = process.env.BUFFER_API_KEY;
const BUFFER_ORGANIZATION_ID = process.env.BUFFER_ORGANIZATION_ID;

// Available channels
const CHANNELS = {
  twitter: process.env.BUFFER_TWITTER_PROFILE_ID,
  instagram: process.env.BUFFER_INSTAGRAM_PROFILE_ID,
  tiktok: process.env.BUFFER_TIKTOK_PROFILE_ID,
  linkedin: process.env.BUFFER_LINKEDIN_PROFILE_ID,
  facebook: process.env.BUFFER_FACEBOOK_PROFILE_ID
};

// Platform character limits
const LIMITS = {
  twitter: 280,
  instagram: 2200,
  tiktok: 2200,
  linkedin: 3000,
  facebook: 5000
};

/**
 * Make a GraphQL request
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
 * Create a single post
 */
async function createPost(profileId, text) {
  const mutation = `
    mutation CreatePost {
      createPost(
        profileId: "${profileId}"
        text: "${text.replace(/"/g, '\\"')}"
      ) {
        id
        text
        status
      }
    }
  `;

  const result = await graphqlRequest(mutation);
  return result;
}

/**
 * Create posts on all specified platforms
 */
async function createBatchPosts(platforms, text) {
  console.log(`🔄 Creating posts for ${platforms.length} platform(s)\n`);

  const results = [];
  const errors = [];

  // Process sequentially to respect rate limits
  for (const platform of platforms) {
    const profileId = CHANNELS[platform];
    
    if (!profileId) {
      errors.push({ platform, error: 'Channel not configured' });
      console.log(`❌ ${platform}: Channel not configured`);
      continue;
    }

    // Check character limit
    const limit = LIMITS[platform];
    if (text.length > limit) {
      errors.push({ platform, error: `Text too long (${text.length}/${limit})` });
      console.log(`❌ ${platform}: Text exceeds ${limit} characters`);
      continue;
    }

    try {
      console.log(`📝 Posting to ${platform}...`);
      const result = await createPost(profileId, text);

      if (result.errors) {
        errors.push({ platform, error: result.errors[0].message });
        console.log(`❌ ${platform}: ${result.errors[0].message}`);
      } else {
        results.push({ 
          platform, 
          postId: result.data.createPost.id,
          status: result.data.createPost.status 
        });
        console.log(`✅ ${platform}: Created (ID: ${result.data.createPost.id.slice(0, 16)}...)`);
      }

      // Rate limiting: wait 1 second between posts
      if (platforms.indexOf(platform) < platforms.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      errors.push({ platform, error: error.message });
      console.log(`❌ ${platform}: ${error.message}`);
    }
  }

  return { results, errors };
}

/**
 * Create posts with platform-specific variations
 */
async function createVariantPosts(variants) {
  console.log(`🔄 Creating ${variants.length} varied post(s)\n`);

  const results = [];
  const errors = [];

  for (const { platform, text } of variants) {
    const profileId = CHANNELS[platform];
    
    if (!profileId) {
      errors.push({ platform, error: 'Channel not configured' });
      continue;
    }

    try {
      console.log(`📝 Posting to ${platform}...`);
      const result = await createPost(profileId, text);

      if (result.errors) {
        errors.push({ platform, error: result.errors[0].message });
      } else {
        results.push({ 
          platform, 
          postId: result.data.createPost.id,
          status: result.data.createPost.status 
        });
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      errors.push({ platform, error: error.message });
    }
  }

  return { results, errors };
}

/**
 * Main execution
 */
async function main() {
  const text = process.argv.slice(2).join(' ');

  if (!text || text === '--help') {
    console.log('🚀 Buffer Batch Post\n');
    console.log('Usage:');
    console.log('  node 04-batch-post.js "Your post text"');
    console.log('  PLATFORMS=twitter,instagram node 04-batch-post.js "Hello"');
    console.log('');
    console.log('Examples:');
    console.log('  # Post to all configured platforms:');
    console.log('  node 04-batch-post.js "Launch announcement!"');
    console.log('');
    console.log('  # Post to specific platforms:');
    console.log('  PLATFORMS=twitter,linkedin node 04-batch-post.js "Professional update"');
    console.log('');
    console.log('  # Post different text per platform:');
    console.log('  node 04-batch-post.js --variants');
    console.log('');
    console.log('Configured platforms:');
    Object.entries(CHANNELS).forEach(([name, id]) => {
      console.log(`  ${id ? '✅' : '❌'} ${name} (limit: ${LIMITS[name]})`);
    });
    process.exit(0);
  }

  // Get platforms from environment or use all configured
  const envPlatforms = process.env.PLATFORMS;
  let platforms;

  if (envPlatforms) {
    platforms = envPlatforms.split(',').map(p => p.trim().toLowerCase());
  } else {
    // Use all configured platforms
    platforms = Object.entries(CHANNELS)
      .filter(([, id]) => id)
      .map(([name]) => name);
  }

  if (platforms.length === 0) {
    console.error('❌ No platforms configured');
    console.error('   Set BUFFER_*_PROFILE_ID variables in .env.local');
    process.exit(1);
  }

  console.log('📋 Batch Post Configuration\n');
  console.log(`Platforms: ${platforms.join(', ')}`);
  console.log(`Text:      ${text.substring(0, 60)}${text.length > 60 ? '...' : ''}`);
  console.log(`Length:    ${text.length} characters\n`);

  const { results, errors } = await createBatchPosts(platforms, text);

  console.log('\n📊 Summary');
  console.log('─'.repeat(40));
  console.log(`✅ Successful: ${results.length}`);
  console.log(`❌ Failed:     ${errors.length}`);

  if (results.length > 0) {
    console.log('\n✅ Created posts:');
    results.forEach(r => {
      console.log(`   ${r.platform}: ${r.postId}`);
    });
  }

  if (errors.length > 0) {
    console.log('\n❌ Failed posts:');
    errors.forEach(e => {
      console.log(`   ${e.platform}: ${e.error}`);
    });
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createBatchPosts, createVariantPosts };
