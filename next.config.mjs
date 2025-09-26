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
  // Removed experimental.serverExternalPackages as it's unrecognized and causing issues.
};

export default nextConfig;