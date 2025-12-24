// https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for TypeScript path aliases
config.resolver.alias = {
    '@': './src',
    '@components': './src/components',
    '@lib': './src/lib',
    '@hooks': './src/hooks',
    '@stores': './src/stores',
    '@types': './src/types',
    '@assets': './assets',
};

module.exports = config;
