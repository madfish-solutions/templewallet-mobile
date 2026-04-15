import { StyleSheet } from 'react-native';

import { formatSize } from 'src/styles/format-size';

export const AddressInputStyles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  buttonsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: formatSize(12),
    right: formatSize(12)
  }
});
