import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useSwapRouteInfoStyles = createUseStyles(({ colors }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  text: {
    color: colors.gray2,
    fontSize: formatSize(12)
  }
}));
