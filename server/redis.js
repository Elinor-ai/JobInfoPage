const Redis = require('ioredis');
// This module initializes a Redis client. 
// It reads the Redis connection URL from an environment variable and exports the connected client for use in other modules. 
// The module handles connection and error events gracefully


// Initialize Redis client using URL from environment
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redisClient.on('error', (err) => {
  console.error('Redis client error', err);
});

module.exports = redisClient;
