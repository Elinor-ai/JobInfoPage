// server/redis.js

// This module initializes a Redis client. 
// It reads the Redis connection URL from an environment variable and exports the connected client for use in other modules. 
// The module handles connection and error events gracefully

const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis client error', err);
});

// async function connectRedis() {
//   if (!redisClient.isOpen) {
//     await redisClient.connect();
//   }
// }

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})()

module.exports = redisClient;
