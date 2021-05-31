import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useConfirmModalStyles = createUseStyles(({ colors, typography }) => ({
  errorMessage: {
    ...typography.body17Semibold,
    alignItems: 'center',
    color: colors.destructive
  },
  loadingMessage: {
    ...typography.body17Semibold,
    alignItems: 'center',
    color: colors.black
  }
}));
