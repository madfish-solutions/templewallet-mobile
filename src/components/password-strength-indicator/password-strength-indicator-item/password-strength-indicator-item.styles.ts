import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const usePasswordStrengthIndicatorItemStyles = createUseStyles(({ colors, typography }) => ({
  adding: {
    color: colors.adding
  },
  destructive: {
    color: colors.destructive
  },
  text: {
    ...typography.caption11Regular,
    color: colors.gray1,
    marginLeft: formatSize(6)
  }
}));
