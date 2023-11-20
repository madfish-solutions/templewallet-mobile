import { StyleSheet } from 'react-native';

import { formatSize } from 'src/styles/format-size';

export const NotificationsStyles = StyleSheet.create({
  contentContainer: {
    paddingBottom: formatSize(16),
    paddingTop: 0,
    paddingHorizontal: 0
  },
  ads: {
    margin: formatSize(16)
  }
});
