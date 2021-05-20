import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useScreenContainerStyles = createUseStyles(({ colors }) => ({
  scrollView: {
    backgroundColor: colors.pageBG
  },
  scrollViewContentContainer: {
    padding: formatSize(8)
  },
  fullScreenMode: {
    justifyContent: 'space-between'
  }
}));
