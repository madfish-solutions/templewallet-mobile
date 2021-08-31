import { black } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';
import { generateShadow } from '../../../styles/generate-shadow';
import { androidStyles, iosStyles } from '../../../utils/conditional-style';

export const useSideBarStyles = createUseStyles(({ colors }) => ({
  container: {
    width: formatSize(200),
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
