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
      // External dependencies for server-side (but not playwright-aws-lambda)
      config.externals = [
        ...config.externals,
        // Remove playwright-aws-lambda from externals to allow proper bundling
        // 'playwright-aws-lambda', // Commented out
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
    // Ignore binary files
    config.module.rules.push({
      test: /\.(ttf|woff|woff2)$/,
      type: 'asset/resource',
    });
    return config;
  },
}

export default nextConfig