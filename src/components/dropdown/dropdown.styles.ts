import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useDropdownStyles = createUseStyles(({ colors }) => ({
  valueContainer: {
    flexGrow: 1
  },
  scrollView: {
    backgroundColor: colors.pageBG
  },
  contentContainer: {
    justifyContent: 'space-between',
    padding: formatSize(8)
  },
  nativeLikeItemContainer: {
    alignItems: 'center',
    shadowColor: 'transparent',
    margin: 0,
    borderRadius: 0,
    borderBottomWidth: formatSize(0.5),
    borderBottomColor: colors.lines,
    paddingVertical: formatSize(6)
  },
  nativeLikeContentContainer: {
    padding: 0
  },
  nativeLikeScrollView: {
    borderBottomColor: colors.lines
  },
  nativeLikeValueContainer: {
    flexDirection: 'row'
  }
}));
