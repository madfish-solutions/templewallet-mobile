import { createUseStyles } from '../../../styles/create-use-styles';

export const usePasswordStrengthIndicatorItemStyles = createUseStyles(({ colors, typography }) => ({
  adding: {
    color: colors.adding
  },
  destructive: {
    color: colors.destructive
  },
  text: {
    ...typography.caption11Regular,
    color: colors.gray1
  }
}));
