import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useScreenContainerStyles = createUseStyles(({ colors }) => ({
  scrollView: {
    backgroundColor: colors.pageBG
  },
  scrollViewContentContainer: {
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(16)
  },
  fullScreenMode: {
    flexGrow: 1,
    justifyContent: 'space-between'
  }
}));
