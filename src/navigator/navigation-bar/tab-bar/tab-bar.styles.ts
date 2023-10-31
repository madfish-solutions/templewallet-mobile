import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTabBarStyles = createUseStylesMemoized(({ colors }) => ({
  container: {
    backgroundColor: colors.navigation
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: formatSize(0.5),
    borderTopColor: colors.lines
  }
}));
