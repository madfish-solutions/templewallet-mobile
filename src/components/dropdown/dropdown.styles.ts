import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useDropdownStyles = createUseStyles(({ colors }) => ({
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
  }
}));
