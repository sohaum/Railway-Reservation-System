/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Configure images
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  
  // Environment variables
  env: {
    // Add any environment variables you need on the server side
  },
  
  // Webpack configuration (optional)
  webpack: (config) => {
    return config;
  },
  
  // Disable TypeScript checking during build (temporary)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during build (temporary)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;