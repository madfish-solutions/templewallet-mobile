module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin', ['@babel/plugin-proposal-decorators', { legacy: true }]],
  env: {
    production: {
      plugins: ['transform-remove-console']
    }
  }
};
