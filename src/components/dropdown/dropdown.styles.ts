import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useDropdownStyles = createUseStyles(({ colors }) => ({
  valueContainer: {
    flexGrow: 1,
    flexShrink: 1
  },
  scrollView: {
    backgroundColor: colors.pageBG
  },
  contentContainer: {
    justifyContent: 'space-between',
    padding: formatSize(8)
  }
}));
