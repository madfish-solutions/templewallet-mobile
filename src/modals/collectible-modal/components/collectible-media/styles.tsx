import { createUseStylesMemoized } from 'src/styles/create-use-styles';

export const useCollectibleMediaStyles = createUseStylesMemoized(() => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  }
}));
