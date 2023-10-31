import { black, SIDEBAR_WIDTH } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';
import { androidStyles, iosStyles } from 'src/utils/conditional-style';

export const useSideBarStyles = createUseStylesMemoized(({ colors }) => ({
  container: {
    width: formatSize(SIDEBAR_WIDTH),
    backgroundColor: colors.navigation,
    ...iosStyles({
      ...generateShadow(1, black),
      zIndex: 1
    }),
    ...androidStyles({
      borderRightWidth: formatSize(0.5),
      borderRightColor: colors.lines
    })
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between'
  }
}));
