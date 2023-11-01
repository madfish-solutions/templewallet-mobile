import { StyleSheet } from 'react-native';

import { formatSize } from 'src/styles/format-size';

export const SettingsStyles = StyleSheet.create({
  iconContainer: {
    position: 'relative'
  },
  notificationDotIcon: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: formatSize(4)
  }
});
