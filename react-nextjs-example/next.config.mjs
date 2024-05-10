const nextConfig = {
    webpack: (config) => {
        config.externals = [...config.externals, { canvas: 'canvas' }];
        return config;
    },
};

export default nextConfig;
