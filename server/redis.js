const Redis = require('ioredis');

// Initialize Redis client using URL from environment
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redisClient.on('error', (err) => {
  console.error('Redis client error', err);
});

module.exports = redisClient;
