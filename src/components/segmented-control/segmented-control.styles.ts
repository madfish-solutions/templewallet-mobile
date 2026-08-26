import { StyleSheet } from 'react-native';

import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { combineBoxShadows, generateBoxShadow } from 'src/styles/shadows';

export const tileMargin = formatSize(2);

export const useSegmentedControlStyles = createUseStyles(({ colors }) => ({
  container: {
    position: 'relative',
    height: formatSize(28),
    borderRadius: formatSize(8),
    backgroundColor: colors.lines,
    padding: formatSize(2)
  },
  tile: {
    ...StyleSheet.absoluteFill,
    boxShadow: combineBoxShadows(
      generateBoxShadow(0, 3, 1, 0, '#0000000A'),
      generateBoxShadow(0, 3, 8, 0, '#0000001F')
    ),
    zIndex: 1,
    margin: tileMargin,
    borderRadius: formatSize(8),
    backgroundColor: colors.navigation
  },
  contentContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
    flexDirection: 'row',
    padding: formatSize(2)
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: formatSize(8)
  }
}));
