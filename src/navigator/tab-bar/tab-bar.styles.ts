import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useTabBarStyles = createUseStyles(({ colors }) => ({
  container: {
    backgroundColor: colors.navigation,
    position: 'absolute',
    left: 0,
    width: '100%'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: formatSize(0.5),
    borderTopColor: colors.lines
  }
}));
