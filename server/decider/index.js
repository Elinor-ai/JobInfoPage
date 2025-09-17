const strategies = require('./strategies');

async function getVariant(userId, flow, metadata = {}) {
  // choose default strategy; you could choose based on flow or metadata
  const strategy = strategies.default;
  const variant = await strategy(userId, flow, metadata);
  return variant;
}

module.exports = { getVariant };
