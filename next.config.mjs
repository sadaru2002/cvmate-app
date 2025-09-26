/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone', // Keep standalone output for Vercel serverless functions
  experimental: {
    serverExternalPackages: [
      'playwright-aws-lambda',
      'playwright-core', // Explicitly externalize playwright-core
      // Add other packages here if they cause bundling issues on Vercel
    ],
  },
};

export default nextConfig;