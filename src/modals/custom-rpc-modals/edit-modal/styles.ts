import { createUseStylesMemoized } from 'src/styles/create-use-styles';

export const useEditModalStyles = createUseStylesMemoized(({ colors }) => ({
  destructive: {
    color: colors.destructive
  }
}));
