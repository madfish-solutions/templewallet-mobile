import { StyleSheet } from 'react-native';

import { formatSize } from 'src/styles/format-size';

export const CollectiblesListStyles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row'
  },
  contentContainer: {
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    paddingHorizontal: formatSize(12)
  }
});
