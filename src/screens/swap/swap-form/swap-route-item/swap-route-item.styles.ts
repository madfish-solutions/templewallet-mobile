import { createUseStylesMemoized } from 'src/styles/create-use-styles';

export const useSwapRouteItem = createUseStylesMemoized(() => ({
  flex: {
    flex: 1,
    flexDirection: 'row'
  },
  container: {
    justifyContent: 'space-between'
  },
  hopsContainer: {
    position: 'relative',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  iconWrapper: {
    position: 'absolute',
    left: 0,
    overflow: 'hidden',
    width: '100%'
  }
}));
