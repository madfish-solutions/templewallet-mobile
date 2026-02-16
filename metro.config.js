/* eslint-disable @typescript-eslint/no-require-imports */
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withSentryConfig } = require('@sentry/react-native/metro');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

module.exports = withSentryConfig(
  mergeConfig(defaultConfig, {
    transformer: {
      ...defaultConfig.transformer,
      babelTransformerPath: require.resolve('react-native-svg-transformer')
    },
    resolver: {
      ...defaultConfig.resolver,
      extraNodeModules: {
        ...require('node-libs-react-native'),
        /* This is a way to account for TS aliases (tsconfig paths) */
        src: path.resolve(__dirname, 'src'),
        /* Mock browser-specific beacon packages */
        '@airgap/beacon-dapp': path.resolve(__dirname, 'src/mocks/airgap-beacon-dapp.mock.js'),
        '@airgap/beacon-ui': path.resolve(__dirname, 'src/mocks/airgap-beacon-ui.mock.js'),
        '@airgap/beacon-transport-postmessage': path.resolve(
          __dirname,
          'src/mocks/airgap-beacon-transport-postmessage.mock.js'
        )
      },
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg', 'cjs'],
      resolveRequest: (context, moduleName, platform) => {
        // Use axios browser build so Node-only deps (e.g. http2) are never pulled in
        if (moduleName === 'axios' || moduleName.includes('axios/dist/node/')) {
          return {
            filePath: require.resolve('axios/dist/browser/axios.cjs'),
            type: 'sourceFile'
          };
        }
  
        return context.resolveRequest(context, moduleName, platform);
      }
    }
  })
);
