import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const SCREEN_HORIZONTAL_PADDING = formatSize(16);

export const useScreenContainerStyles = createUseStyles(({ colors }) => ({
  scrollView: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: colors.pageBG
  },
  scrollViewContentContainer: {
    paddingTop: formatSize(8),
    paddingBottom: SCREEN_HORIZONTAL_PADDING,
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING
  },
  fullScreenMode: {
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  fixedButtonContainer: {
    borderTopWidth: formatSize(0.5),
    borderColor: colors.lines,
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
    backgroundColor: colors.navigation
  }
}));
