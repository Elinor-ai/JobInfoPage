const strategies = require('./strategies');
const redisClient = require('../redis')

/**
 * @param {string} userId - unique identifier for the visitor (e.g. cookie value)
 * @param {string} flow - optinal flow name ("default" if not provided) 
 * @param {object} metadata - any additional data that could influence strategy
 * @returns {Promise<string>} variant name
 */

async function getVariant(userId, flow = 'default', metadata = {}) {
  const strategy = strategies[flow]|| strategies.default;
  const cacheKey = `variant:${userId}:${flow}`;

  if (redisClient && redisClient.isReady) {
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) return cached
    } catch (err) {
      console.error('Redis get error', err);
    }
  }

  const variant = await strategy(userId, flow, metadata);
  if (redisClient && redisClient.isReady) {
    try {
      await redisClient.set(cacheKey, variant);
    } catch (err) {
      console.error('Redis set error', err)
    }
  }
  return variant;
}

module.exports = { getVariant };
