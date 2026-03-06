/**
 * Buffer GraphQL API - Error Handling Example
 * 
 * Demonstrates robust error handling for Buffer API operations.
 * Includes retry logic, rate limiting, and graceful fallbacks.
 */

require('dotenv').config();

const BUFFER_API_KEY = process.env.BUFFER_API_KEY;

/**
 * Custom error classes for specific Buffer errors
 */
class BufferAPIError extends Error {
  constructor(message, code, originalError = null) {
    super(message);
    this.name = 'BufferAPIError';
    this.code = code;
    this.originalError = originalError;
  }
}

class RateLimitError extends BufferAPIError {
  constructor(retryAfter) {
    super('Rate limit exceeded', 'RATE_LIMITED');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

class TextTooLongError extends BufferAPIError {
  constructor(platform, length, limit) {
    super(
      `Text too long for ${platform}: ${length}/${limit} characters`,
      'TEXT_TOO_LONG'
    );
    this.name = 'TextTooLongError';
    this.platform = platform;
    this.length = length;
    this.limit = limit;
  }
}

class UnauthorizedError extends BufferAPIError {
  constructor() {
    super('Invalid API key or unauthorized', 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

class ChannelNotFoundError extends BufferAPIError {
  constructor(channelId) {
    super(`Channel not found: ${channelId}`, 'CHANNEL_NOT_FOUND');
    this.name = 'ChannelNotFoundError';
    this.channelId = channelId;
  }
}

/**
 * Rate limiter implementation
 */
class RateLimiter {
  constructor(requestsPerMinute = 50) {
    this.requests = [];
    this.windowMs = 60000; // 1 minute
    this.maxRequests = requestsPerMinute;
  }

  async checkLimit() {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      throw new RateLimitError(Math.ceil(waitTime / 1000));
    }
    
    this.requests.push(now);
  }
}

const limiter = new RateLimiter();

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Make a GraphQL request with error handling
 */
async function graphqlRequest(query, variables = {}, options = {}) {
  const maxRetries = options.maxRetries || 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Check rate limit before making request
      await limiter.checkLimit();

      const response = await fetch('https://api.buffer.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BUFFER_API_KEY}`
        },
        body: JSON.stringify({ query, variables })
      });

      // Handle HTTP errors
      if (!response.ok) {
        if (response.status === 401) {
          throw new UnauthorizedError();
        }
        if (response.status === 429) {
          const retryAfter = response.headers.get('X-RateLimit-Reset');
          throw new RateLimitError(retryAfter);
        }
        throw new BufferAPIError(
          `HTTP ${response.status}: ${response.statusText}`,
          'HTTP_ERROR'
        );
      }

      const result = await response.json();

      // Handle GraphQL errors
      if (result.errors) {
        const error = result.errors[0];
        const code = error.extensions?.code || 'UNKNOWN';

        switch (code) {
          case 'UNAUTHORIZED':
            throw new UnauthorizedError();
          
          case 'TEXT_TOO_LONG':
            throw new TextTooLongError('unknown', 0, 0);
          
          case 'PROFILE_NOT_FOUND':
          case 'CHANNEL_NOT_FOUND':
            throw new ChannelNotFoundError(variables?.input?.organizationId || 'unknown');
          
          case 'RATE_LIMITED':
            throw new RateLimitError(60); // Default to 60s
          
          default:
            throw new BufferAPIError(error.message, code);
        }
      }

      return result;

    } catch (error) {
      lastError = error;

      // Don't retry authentication errors
      if (error instanceof UnauthorizedError) {
        throw error;
      }

      // Exponential backoff for rate limits and network errors
      if (error instanceof RateLimitError || error.name === 'FetchError') {
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          
          if (process.env.DEBUG) {
            console.log(`  ⚠️ Attempt ${attempt} failed: ${error.message}`);
            console.log(`  ⏱  Retrying in ${Math.round(delay / 1000)}s...`);
          }
          
          await sleep(delay);
          continue;
        }
      }

      // Other errors: throw immediately
      throw error;
    }
  }

  throw new BufferAPIError(
    `Failed after ${maxRetries} attempts: ${lastError.message}`,
    'MAX_RETRIES_EXCEEDED',
    lastError
  );
}

/**
 * Create a post with comprehensive error handling
 */
async function createPostSafe(profileId, text, options = {}) {
  const maxLen = options.maxLength || 280;

  // Pre-validate text length
  if (text.length > maxLen) {
    throw new TextTooLongError('platform', text.length, maxLen);
  }

  const mutation = `
    mutation CreatePost {
      createPost(
        profileId: "${profileId}"
        text: "${text.replace(/"/g, '\\"')}"
      ) {
        id
        status
        text
      }
    }
  `;

  return await graphqlRequest(mutation);
}

/**
 * Get channels with error handling
 */
async function getChannelsSafe(organizationId) {
  const query = `
    query GetChannels($input: ChannelsInput!) {
      channels(input: $input) {
        id
        service
        displayName
      }
    }
  `;

  const variables = {
    input: { organizationId }
  };

  const result = await graphqlRequest(query, variables);
  return result.data.channels;
}

/**
 * Main execution - demonstrates error handling
 */
async function main() {
  console.log('🔧 Buffer Error Handling Demo\n');

  // Test 1: Unauthorized (if no API key)
  console.log('Test 1: API Key Validation');
  try {
    if (!BUFFER_API_KEY) {
      throw new UnauthorizedError();
    }
    console.log('✅ API key present\n');
  } catch (error) {
    console.error('❌', error.message);
    console.error('   Set BUFFER_API_KEY in .env.local\n');
  }

  // Test 2: Text too long
  console.log('Test 2: Text Length Validation');
  try {
    const longText = 'a'.repeat(300);
    const maxLen = 280;
    
    if (longText.length > maxLen) {
      throw new TextTooLongError('twitter', longText.length, maxLen);
    }
  } catch (error) {
    if (error instanceof TextTooLongError) {
      console.log(`✅ Caught: ${error.message}`);
      console.log(`   Platform: ${error.platform}`);
      console.log(`   Length: ${error.length}/${error.limit}\n`);
    }
  }

  // Test 3: Graceful error recovery
  console.log('Test 3: Graceful Error Recovery\n');
  
  const testChannels = [
    { name: 'twitter', id: 'valid-id-1' },
    { name: 'instagram', id: null }, // Will fail
    { name: 'tiktok', id: 'valid-id-2' }
  ];

  const results = {
    success: [],
    failed: []
  };

  for (const channel of testChannels) {
    try {
      if (!channel.id) {
        throw new ChannelNotFoundError(channel.name);
      }
      
      // Simulate successful operation
      results.success.push(channel.name);
      console.log(`✅ ${channel.name}: Would succeed`);
      
    } catch (error) {
      results.failed.push({ 
        name: channel.name, 
        error: error.message,
        code: error.code 
      });
      console.log(`⚠️  ${channel.name}: ${error.message}`);
    }
  }

  console.log('\n📊 Recovery Results:');
  console.log(`   Success: ${results.success.length}`);
  console.log(`   Failed:  ${results.failed.length}`);
  console.log('\n   All operations completed despite errors');

  // Test 4: Error classification
  console.log('\nTest 4: Error Classification\n');
  
  const errors = [
    new RateLimitError(60),
    new UnauthorizedError(),
    new TextTooLongError('twitter', 300, 280),
    new BufferAPIError('Unknown error', 'UNKNOWN')
  ];

  errors.forEach(error => {
    console.log(`   ${error.name}:`);
    console.log(`     Code: ${error.code}`);
    console.log(`     Retryable: ${error instanceof RateLimitError}`);
  });
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  BufferAPIError,
  RateLimitError,
  TextTooLongError,
  UnauthorizedError,
  ChannelNotFoundError,
  RateLimiter,
  graphqlRequest,
  createPostSafe,
  getChannelsSafe,
  sleep
};
