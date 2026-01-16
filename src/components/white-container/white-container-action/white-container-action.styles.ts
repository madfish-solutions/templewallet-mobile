import { StyleSheet } from 'react-native';

import { formatSize } from 'src/styles/format-size';

export const WhiteContainerActionStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: formatSize(48),
    padding: formatSize(8)
  }
});
