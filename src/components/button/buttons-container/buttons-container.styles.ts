import { StyleSheet } from 'react-native';

import { formatSize } from 'src/styles/format-size';

export const ButtonsContainerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: formatSize(24)
  }
});
