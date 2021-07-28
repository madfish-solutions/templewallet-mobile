import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useScreenContainerStyles = createUseStyles(({ colors }) => ({
  scrollView: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: colors.pageBG,
    justifyContent: 'flex-end'
  },
  scrollViewContentContainer: {
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    paddingHorizontal: formatSize(16)
  },
  fullScreenMode: {
    flexGrow: 1,
    justifyContent: 'space-between'
  }
}));
