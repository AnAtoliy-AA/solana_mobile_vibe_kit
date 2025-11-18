const { override, overrideDevServer } = require('customize-cra');

const devServerConfig = () => (config) => {
  return {
    ...config,
    proxy: {
      '/api': {
        target: 'https://launch.meme',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        onProxyReq: (proxyReq, req, res) => {
          // Set headers to match launch.meme expectations
          proxyReq.setHeader('origin', 'https://launch.meme');
          proxyReq.setHeader('referer', 'https://launch.meme/');
          proxyReq.setHeader('host', 'launch.meme');
        },
        onProxyRes: (proxyRes, req, res) => {
          // Proxy response received
        },
        onError: (err, req, res) => {
          // Proxy error occurred
        },
      },
    },
  };
};

module.exports = {
  webpack: override((config) => {
    // Ignore source map warnings from node_modules
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /node_modules/,
        message: /Failed to parse source map/,
      },
      /Failed to parse source map/,
    ];

    // Also configure source-map-loader to exclude node_modules
    if (config.module && config.module.rules) {
      config.module.rules.forEach((rule) => {
        if (rule.enforce === 'pre' && rule.use) {
          rule.use.forEach((use) => {
            if (use.loader && use.loader.includes('source-map-loader')) {
              if (!rule.exclude) {
                rule.exclude = /node_modules/;
              } else if (Array.isArray(rule.exclude)) {
                rule.exclude.push(/node_modules/);
              } else {
                rule.exclude = [rule.exclude, /node_modules/];
              }
            }
          });
        }
      });
    }

    return config;
  }),
  devServer: overrideDevServer(devServerConfig()),
};
