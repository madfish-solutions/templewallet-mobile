import { createUseStylesMemoized } from 'src/styles/create-use-styles';

export const useSimpleModelViewStyles = createUseStylesMemoized(() => ({
  lowerOpacity: {
    opacity: 0.99
  }
}));
