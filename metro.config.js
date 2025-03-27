const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = mergeConfig(defaultConfig, {});

// Ensure transformer is initialized
config.transformer = {
  ...defaultConfig.transformer, // Spread existing transformer config
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

// Ensure resolver is initialized
config.resolver = {
  ...defaultConfig.resolver, // Spread existing resolver config
  assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
};

// Wrap with NativeWind and Reanimated configurations
module.exports = wrapWithReanimatedMetroConfig(
  withNativeWind(config, { input: './global.css' })
);
