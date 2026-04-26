/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Disable Vercel's image optimization proxy — use images directly from their CDN
    unoptimized: true,
  },
};

module.exports = nextConfig;