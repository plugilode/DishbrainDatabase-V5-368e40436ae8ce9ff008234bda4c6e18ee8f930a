/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: true,
    optimizeCss: true, // Ensure CSS is optimized
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });

    // Add node polyfills (for working with node dependencies)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    // Ignore specific warnings related to modules (like punycode)
    config.ignoreWarnings = [
      { module: /node_modules\/punycode/ }
    ];

    return config;
  },
  env: {
    PORT: "3001",
  },
  images: {
    domains: ['localhost', 'your-production-domain.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
};

module.exports = nextConfig;
