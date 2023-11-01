import { StyleSheet } from 'react-native';

import { formatSize } from 'src/styles/format-size';

export const GRID_GAP = formatSize(4);

export const CollectiblesListStyles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    flex: 1
  },
  marginRight: {
    marginRight: GRID_GAP
  }
});
