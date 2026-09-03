import { createUseStylesMemoized } from 'src/styles/create-use-styles';

export const useAddAssetModalStyles = createUseStylesMemoized(({ colors, typography }) => ({
  input: {
    ...typography.body17Regular
  },
  disabledInput: {
    color: colors.gray2
  }
}));
