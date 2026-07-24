import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useDropdownStyles = createUseStyles(({ typography, colors }) => ({
  searchContainer: {
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(12),
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchInputContainer: {
    flexGrow: 1,
    flexShrink: 1
  },
  valueContainer: {
    flexGrow: 1,
    flexShrink: 1
  },
  contentContainer: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: colors.pageBG
  },
  flatListContentContainer: {
    justifyContent: 'space-between',
    padding: formatSize(16),
    paddingTop: formatSize(4)
  },
  sectionHeaderText: {
    ...typography.caption13Regular,
    lineHeight: formatSize(18),
    color: colors.gray1,
    paddingTop: formatSize(4),
    backgroundColor: colors.pageBG,
    letterSpacing: formatSize(-0.08)
  },
  activityIndicatorContainer: {
    height: '90%',
    justifyContent: 'center'
  }
}));
