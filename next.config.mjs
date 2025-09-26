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
  
  // Removed experimental.serverExternalPackages as it's unrecognized and causing issues.
  
  // Use webpack.externals to explicitly exclude problematic modules from the server bundle
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push(
        // Exclude playwright-core and its internal dependencies
        'playwright-core', 
        'playwright', // Include 'playwright' as well, just in case
        'chromium-bidi', // Specific problematic internal dependency
        'electron', // Another problematic internal dependency
        // Keep playwright-aws-lambda external as it's a serverless-specific dependency
        'playwright-aws-lambda',
        // Also ensure mongodb is externalized if it's causing issues
        'mongodb'
      );
    }
    return config;
  }
}

export default nextConfig