import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useScreenContainerStyles = createUseStyles(({ colors }) => ({
  scrollViewContentContainer: {
    backgroundColor: colors.cardBG,
    padding: formatSize(8)
  },
  fullScreenMode: {
    justifyContent: 'space-between'
  }
}));
