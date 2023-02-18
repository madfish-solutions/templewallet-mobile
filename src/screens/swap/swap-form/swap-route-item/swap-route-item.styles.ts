import { createUseStyles } from 'src/styles/create-use-styles';

export const useSwapRouteItem = createUseStyles(({ colors }) => ({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  amount: {
    color: colors.gray2
  },
  percantage: {
    color: colors.blue
  }
}));
