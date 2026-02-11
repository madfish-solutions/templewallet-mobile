// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('@react-native/metro-config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

const {
  resolver: { sourceExts, assetExts }
} = defaultConfig;

module.exports = {
  ...defaultConfig,
  transformer: {
    ...defaultConfig.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true
      }
    }),
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
};
