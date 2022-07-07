import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useExolixStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    backgroundColor: colors.navigation
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: formatSize(0.5),
    borderTopColor: colors.lines
  },
  description: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
