import { StyleSheet } from 'react-native';

import { formatSize } from 'src/styles/format-size';

export const NotificationsStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingBottom: formatSize(16)
  },
  ads: {
    margin: formatSize(16)
  }
});
