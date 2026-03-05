#!/usr/bin/env node
/**
 * Buffer GraphQL API Integration
 * Post to Twitter, TikTok, Instagram via Buffer
 */

require('dotenv').config({ path: `${process.env.HOME}/.openclaw/workspace/projects/al-does-ai/.env.local` });

const BUFFER_API_KEY = process.env.BUFFER_API_KEY;
const BUFFER_ORGANIZATION_ID = process.env.BUFFER_ORGANIZATION_ID;

const CHANNELS = {
  twitter: process.env.BUFFER_TWITTER_PROFILE_ID,
  tiktok: process.env.BUFFER_TIKTOK_PROFILE_ID,
  instagram: process.env.BUFFER_INSTAGRAM_PROFILE_ID
};

async function graphqlRequest(query, variables = {}) {
  const response = await fetch('https://api.buffer.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BUFFER_API_KEY}`
    },
    body: JSON.stringify({ query, variables })
  });
  return await response.json();
}

async function getChannels() {
  const query = `
    query GetChannels($input: ChannelsInput!) {
      channels(input: $input) {
        id
        service
        displayName
        name
        externalLink
      }
    }
  `;
  
  const result = await graphqlRequest(query, { 
    input: { organizationId: BUFFER_ORGANIZATION_ID }
  });
  
  return result.data?.channels || [];
}

async function createPost(channelId, text) {
  // Buffer createPost mutation
  // Note: May need adjustment - testing required
  const mutation = `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        id
        status
        text
        channel {
          id
          service
        }
      }
    }
  `;
  
  const result = await graphqlRequest(mutation, {
    input: {
      organizationId: BUFFER_ORGANIZATION_ID,
      channelId,
      text
    }
  });
  
  return result;
}

// CLI usage
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'channels':
      getChannels().then(channels => {
        console.log('\nConnected Channels:');
        console.log('==================');
        channels.forEach(ch => {
          console.log(`${ch.service.toUpperCase()}: ${ch.displayName}`);
          console.log(`  ID: ${ch.id}`);
          console.log(`  URL: ${ch.externalLink}\n`);
        });
      });
      break;
      
    case 'post':
      const platform = process.argv[3];
      const text = process.argv.slice(4).join(' ');
      
      if (!CHANNELS[platform]) {
        console.error(`Unknown platform: ${platform}`);
        console.error('Use: twitter, tiktok, or instagram');
        process.exit(1);
      }
      
      if (!text) {
        console.error('No text provided');
        console.error('Usage: node buffer-graphql.js post twitter "Your text here"');
        process.exit(1);
      }
      
      console.log(`Posting to ${platform}...`);
      console.log(`Text: ${text}\n`);
      
      createPost(CHANNELS[platform], text).then(result => {
        if (result.errors) {
          console.error('Error:', result.errors[0].message);
          process.exit(1);
        }
        console.log('Success:', JSON.stringify(result.data, null, 2));
      });
      break;
      
    default:
      console.log('Buffer GraphQL API Client');
      console.log('=========================\n');
      console.log('Commands:');
      console.log('  channels              List connected channels');
      console.log('  post [platform] text  Post to platform (twitter/tiktok/instagram)');
      console.log('\nExamples:');
      console.log('  node buffer-graphql.js channels');
      console.log('  node buffer-graphql.js post twitter "Hello from Al Does AI!"');
      break;
  }
}

module.exports = { getChannels, createPost, CHANNELS };
