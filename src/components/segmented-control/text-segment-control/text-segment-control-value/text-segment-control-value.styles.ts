import { createUseStyles } from 'src/styles/create-use-styles';

export const useTextSegmentControlValueStyles = createUseStyles(({ colors, typography }) => ({
  text: {
    ...typography.caption13Semibold
  },
  disabled: {
    color: colors.gray3
  }
}));
