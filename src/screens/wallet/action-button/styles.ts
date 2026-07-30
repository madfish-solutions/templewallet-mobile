import { StyleSheet } from 'react-native';

import { formatSize } from 'src/styles/format-size';

export const ActionButtonStyles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    padding: formatSize(8)
  },
  notificationDotIcon: {
    position: 'absolute',
    zIndex: 1,
    top: formatSize(11),
    left: formatSize(12.75)
  }
});
