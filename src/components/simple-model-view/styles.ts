import { createUseStylesMemoized } from 'src/styles/create-use-styles';

export const useSimpleModelViewStyles = createUseStylesMemoized(() => ({
  loverOpacity: {
    opacity: 0.99
  }
}));
