import { StyleSheet } from 'react-native';

import { formatSize } from '../../../styles/format-size';

export const CollectiblesListStyles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    flex: 1
  },
  collectible: {
    marginBottom: formatSize(4)
  },
  marginRight: {
    marginRight: formatSize(4)
  }
});
