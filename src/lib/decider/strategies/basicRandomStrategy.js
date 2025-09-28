const variants = ['classic', 'light', 'panel', 'minimal'];

function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0;
  }
  return hash >>> 0;
}
async function basicRandomStrategy(userId, flow, metadata = {}) {
  const hash = fnv1a(userId)
  // const index = Math.floor(Math.random() * variants.length);
  return variants[hash % variants.length];
}

module.exports = basicRandomStrategy;
