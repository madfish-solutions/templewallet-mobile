// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('metro-config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig(__dirname);

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true
        }
      }),
      babelTransformerPath: require.resolve('react-native-svg-transformer')
    },
    resolver: {
      extraNodeModules: {
        ...require('node-libs-react-native'),
        /* This is a way to account for TS aliases (tsconfig paths) */
        src: path.resolve(__dirname, 'src')
      },
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg']
    }
  };
})();
