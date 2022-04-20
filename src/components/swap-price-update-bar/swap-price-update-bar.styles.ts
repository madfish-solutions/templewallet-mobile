import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useSwapPriceUpdateBarStyles = createUseStyles(({ colors }) => ({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressBar: {
    width: '100%',
    height: formatSize(2),
    backgroundColor: colors.liteOrange
  },
  progressBarAnimatedView: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.orange
  },
  progressBarTextStyle: {
    fontSize: formatSize(16),
    color: colors.gray2
  }
}));
