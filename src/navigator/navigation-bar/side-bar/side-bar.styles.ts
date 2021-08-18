import { black } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';
import { generateShadow } from '../../../styles/generate-shadow';

export const useSideBarStyles = createUseStyles(({ colors }) => ({
  container: {
    ...generateShadow(1, black),
    zIndex: 1,
    width: formatSize(200),
    backgroundColor: colors.navigation
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between'
  }
}));
