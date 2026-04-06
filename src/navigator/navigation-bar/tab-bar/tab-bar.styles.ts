import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';

export const useTabBarStyles = createUseStyles(({ colors }) => ({
  container: {
    backgroundColor: colors.navigation
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: DEFAULT_BORDER_WIDTH,
    borderTopColor: colors.lines
  }
}));
