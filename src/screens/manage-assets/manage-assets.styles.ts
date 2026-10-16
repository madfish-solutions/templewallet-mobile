import { StyleSheet } from 'react-native';

import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { iosCardShadow } from 'src/styles/shadows';

export const useManageAssetsStyles = createUseStyles(({ colors, typography }) => ({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(8),
    backgroundColor: colors.pageBG,
    position: 'relative',
    zIndex: 1
  },
  searchRowShadow: {
    ...StyleSheet.absoluteFill,
    top: formatSize(-1),
    backgroundColor: colors.pageBG,
    boxShadow: iosCardShadow
  },
  checkboxText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    marginLeft: formatSize(4)
  },
  searchInputContainer: {
    flex: 1,
    marginLeft: 0
  },
  segmentControlContainer: {
    padding: formatSize(16),
    backgroundColor: colors.pageBG,
    position: 'relative',
    zIndex: 2
  },
  descriptionText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    paddingVertical: formatSize(8),
    marginHorizontal: formatSize(16)
  },
  contentContainerStyle: {
    paddingRight: 0,
    paddingLeft: formatSize(16)
  }
}));
