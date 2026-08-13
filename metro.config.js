/* eslint-disable @typescript-eslint/no-require-imports */
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withSentryConfig } = require('@sentry/react-native/metro');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Browser-only octez.connect packages. The umbrella SDK re-exports these, and they
 * call `windowRef.addEventListener`. RN's `window` has no DOM events API.
 * WalletConnect is also stubbed: Temple mobile does not support it.
 *
 * Must be intercepted in `resolveRequest` (always wins). Yarn resolutions-to-null
 * fail because these packages declare `exports`, and `extraNodeModules` is ignored
 * once the real packages exist in node_modules.
 */
const octezConnectBrowserMocks = {
  '@tezos-x/octez.connect-dapp': path.resolve(__dirname, 'src/mocks/octez-connect-dapp.mock.js'),
  '@tezos-x/octez.connect-ui': path.resolve(__dirname, 'src/mocks/octez-connect-ui.mock.js'),
  '@tezos-x/octez.connect-transport-postmessage': path.resolve(
    __dirname,
    'src/mocks/octez-connect-transport-postmessage.mock.js'
  ),
  '@tezos-x/octez.connect-transport-walletconnect': path.resolve(
    __dirname,
    'src/mocks/octez-connect-transport-walletconnect.mock.js'
  )
};

const resolveOctezConnectBrowserMock = moduleName => {
  const exactPath = octezConnectBrowserMocks[moduleName];
  if (exactPath) {
    return exactPath;
  }

  const scopedPackage = Object.keys(octezConnectBrowserMocks).find(pkg => moduleName.startsWith(`${pkg}/`));

  return scopedPackage ? octezConnectBrowserMocks[scopedPackage] : undefined;
};

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
        src: path.resolve(__dirname, 'src')
      },
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg', 'cjs'],
      resolveRequest: (context, moduleName, platform) => {
        const octezConnectMockPath = resolveOctezConnectBrowserMock(moduleName);
        if (octezConnectMockPath) {
          return {
            filePath: octezConnectMockPath,
            type: 'sourceFile'
          };
        }

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
