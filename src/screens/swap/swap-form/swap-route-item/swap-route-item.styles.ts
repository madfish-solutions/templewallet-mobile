import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSwapRouteItem = createUseStyles(({ colors }) => ({
  flex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    justifyContent: 'space-between'
  },
  hopsContainer: {
    position: 'relative',
    justifyContent: 'space-around'
  },
  icon: {
    position: 'absolute',
    left: formatSize(0)
  },
  amountsContainer: {
    width: formatSize(44)
  },
  amount: {
    color: colors.gray2
  },
  percantage: {
    color: colors.blue
  }
}));
