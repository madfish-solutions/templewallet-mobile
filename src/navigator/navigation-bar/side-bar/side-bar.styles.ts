import { black, DEFAULT_BORDER_WIDTH, SIDEBAR_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';
import { androidStyles, iosStyles } from 'src/utils/conditional-style';

export const useSideBarStyles = createUseStyles(({ colors }) => ({
  container: {
    width: formatSize(SIDEBAR_WIDTH),
    backgroundColor: colors.navigation,
    ...iosStyles({
      ...generateShadow(1, black),
      zIndex: 1
    }),
    ...androidStyles({
      borderRightWidth: DEFAULT_BORDER_WIDTH,
      borderRightColor: colors.lines
    })
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between'
  }
}));
