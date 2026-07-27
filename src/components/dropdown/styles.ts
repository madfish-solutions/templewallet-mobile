import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useDropdownStyles = createUseStyles(({ typography, colors }) => ({
  valueContainer: {
    flexGrow: 1,
    flexShrink: 1
  },
  contentContainer: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: colors.pageBG
  },
  tokenSelectorContentContainer: {
    paddingTop: formatSize(4)
  },
  flatListContentContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(8)
  },
  tokenSelectorListContentContainer: {
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(4)
  },
  sectionHeaderText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    backgroundColor: colors.pageBG,
    paddingVertical: formatSize(4),
    letterSpacing: formatSize(-0.1)
  },
  activityIndicatorContainer: {
    height: '90%',
    justifyContent: 'center'
  }
}));
