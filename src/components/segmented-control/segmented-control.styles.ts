import { StyleSheet } from 'react-native';

import { black, transparent } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const tileMargin = formatSize(2);

export const useSegmentedControlStyles = createUseStyles(({ colors }) => ({
  container: {
    position: 'relative',
    height: formatSize(28),
    borderRadius: formatSize(8),
    backgroundColor: colors.lines
  },
  tile: {
    ...StyleSheet.absoluteFillObject,
    ...generateShadow(1, black),
    zIndex: 1,
    margin: tileMargin,
    borderRadius: formatSize(8),
    backgroundColor: colors.cardBG
  },
  contentContainer: {
    ...StyleSheet.absoluteFillObject,
    ...generateShadow(2, transparent),
    zIndex: 2,
    flexDirection: 'row',
    padding: formatSize(2)
  },
  itemContainer: {
    elevation: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: formatSize(8)
  }
}));
