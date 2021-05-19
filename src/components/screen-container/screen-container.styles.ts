import { StyleSheet } from 'react-native';

import { formatSize } from '../../styles/format-size';

export const ScreenContainerStyles = StyleSheet.create({
  scrollViewContentContainer: {
    padding: formatSize(8)
  },
  fullScreenMode: {
    justifyContent: 'space-between'
  }
});
