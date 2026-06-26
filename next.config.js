/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['images.unsplash.com', 'example.com'],
    },
    webpack: (config, { isServer }) => {
      // Fix for undici and private class fields
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
          crypto: false,
          stream: false,
          util: false,
          buffer: false,
          process: false,
        };
        
        // Add polyfill entry
        const originalEntry = config.entry;
        config.entry = () =>
          originalEntry().then((entry) => {
            if (entry['main.js'] && !entry['main.js'].includes('./polyfills.js')) {
              entry['main.js'].unshift('./polyfills.js');
            }
            return entry;
          });
      }
      
      // Handle undici module parsing and exclude problematic modules
      config.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });

      // Exclude undici from client-side bundle
      config.externals = config.externals || [];
      if (!isServer) {
        config.externals.push('undici');
      }

      return config;
    },
    experimental: {
      esmExternals: 'loose',
    },
  }
  
  module.exports = nextConfig