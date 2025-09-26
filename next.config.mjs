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
  webpack: (config, { isServer }) => {
    if (isServer) {
      // External dependencies for server-side
      config.externals = [
        ...config.externals,
        // External dependencies for serverless compatibility
        'playwright-core',
        'chromium-bidi',
        'electron',
        // MongoDB related externals for serverless deployment
        'aws4',
        '@aws-sdk/credential-providers',
        'mongodb-client-encryption',
        'snappy',
        'kerberos',
        '@mongodb-js/zstd',
        'bson-ext',
      ];
    }
    
    // Handle binary files and source maps
    config.module.rules.push({
      test: /\.(ttf|woff|woff2|js\.map)$/,
      type: 'asset/resource',
    });
    
    return config;
  },
}

export default nextConfig