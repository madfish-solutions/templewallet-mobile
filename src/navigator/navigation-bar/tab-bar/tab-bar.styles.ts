import { DEFAULT_BORDER_WIDTH } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';

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
