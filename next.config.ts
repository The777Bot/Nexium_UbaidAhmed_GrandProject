/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
   // 👈 This tells Next.js where your app folder is
};

module.exports = nextConfig;
