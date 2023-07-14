import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSwapRouteItem = createUseStyles(() => ({
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
  iconWrapper: {
    position: 'absolute',
    left: formatSize(0),
    overflow: 'hidden',
    width: '100%'
  }
}));
