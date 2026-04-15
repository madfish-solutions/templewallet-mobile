import { StyleSheet } from 'react-native';

import { formatSize } from 'src/styles/format-size';

export const MnemonicStyles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  buttonsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: formatSize(8),
    right: formatSize(8)
  }
});
