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
        // Allow puppeteer and chrome-aws-lambda to be bundled
        // 'puppeteer-core', // Commented out to allow bundling
        // 'chrome-aws-lambda', // Commented out to allow bundling
        // Other optional dependencies
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
    
    // Ignore source map files and binary files
    config.module.rules.push({
      test: /\.(ttf|woff|woff2|js\.map)$/,
      type: 'asset/resource',
    });
    
    // Ignore chrome-aws-lambda source maps specifically
    config.module.rules.push({
      test: /chrome-aws-lambda.*\.js\.map$/,
      use: 'ignore-loader',
    });
    
    return config;
  },
}

export default nextConfig