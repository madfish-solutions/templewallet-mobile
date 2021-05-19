import { StyleSheet } from 'react-native';

import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const tileMargin = formatSize(2);

export const useSegmentedControlStyles = createUseStyles(({ colors }) => ({
  container: {
    position: 'relative',
    flexDirection: 'row',
    padding: formatSize(2),
    borderRadius: formatSize(8),
    backgroundColor: colors.lines
  },
  tile: {
    ...StyleSheet.absoluteFillObject,
    ...generateShadow(1, colors.black),
    margin: tileMargin,
    borderRadius: formatSize(8),
    backgroundColor: colors.cardBG
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: formatSize(3),
    paddingHorizontal: formatSize(8)
  }
}));
