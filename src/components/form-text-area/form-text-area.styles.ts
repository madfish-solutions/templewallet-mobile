import { StyleSheet } from 'react-native';

import { formatSize } from '../../styles/format-size';

export const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  textArea: {
    height: formatSize(124),
    textAlignVertical: 'top'
  },
  buttonsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: formatSize(8),
    right: formatSize(8)
  }
});
