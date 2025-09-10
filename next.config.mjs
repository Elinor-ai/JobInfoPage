// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.hays.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'resources.reed.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
    ],
  },

};

export default nextConfig;