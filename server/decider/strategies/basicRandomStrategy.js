const variants = ['classic', 'light', 'panel'];

async function basicRandomStrategy(userId, flow, metadata = {}) {
  const index = Math.floor(Math.random() * variants.length);
  return variants[index];
}

module.exports = basicRandomStrategy;
