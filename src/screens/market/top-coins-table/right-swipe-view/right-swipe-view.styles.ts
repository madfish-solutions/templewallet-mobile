import { createUseStyles } from 'src/styles/create-use-styles';

export const useRightSwipeViewStyles = createUseStyles(() => ({
  rootContainer: {
    flex: 1,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  }
}));
