import { createUseStylesMemoized } from 'src/styles/create-use-styles';

export const useAddAssetModalStyles = createUseStylesMemoized(({ typography }) => ({
  input: {
    ...typography.body17Regular
  }
}));
