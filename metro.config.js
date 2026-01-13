const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ignorar pasta services como rotas
config.resolver.sourceExts.push('ts', 'tsx');

module.exports = config;
