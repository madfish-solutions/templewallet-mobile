import { createUseStylesMemoized } from 'src/styles/create-use-styles';

export const useCollectibleMediaStyles = createUseStylesMemoized(() => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  audioContainer: {
    position: 'relative'
  },
  audio: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0
  }
}));
