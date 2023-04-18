import { StyleSheet } from 'react-native';

import { formatSize } from 'src/styles/format-size';

export const CollectiblesListStyles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row'
  },
  collectiblesContainer: {
    marginBottom: formatSize(300)
  }
});
