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
  flatListContentContainer: {
    justifyContent: 'space-between',
    padding: formatSize(8)
  },
  sectionHeaderText: {
    ...typography.numbersMedium13,
    color: colors.gray2,
    backgroundColor: colors.pageBG,
    paddingVertical: formatSize(4),
    letterSpacing: formatSize(-0.1)
  },
  activityIndicatorContainer: {
    height: '90%',
    justifyContent: 'center'
  }
}));
