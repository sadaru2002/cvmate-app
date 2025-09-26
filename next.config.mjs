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
  output: 'standalone',
  
  // Removed the problematic webpack.externals block related to playwright
  // We want playwright-aws-lambda and its dependencies to be bundled for the serverless function.
  // If issues arise, we'll re-evaluate externals for specific native modules.
}

export default nextConfig