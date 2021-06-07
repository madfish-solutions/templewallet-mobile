import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useSliderStyles = createUseStyles(({ colors }) => ({
  slider: {
    height: formatSize(28)
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  icon: {
    color: colors.gray1,
    width: formatSize(24),
    height: formatSize(24)
  }
}));
