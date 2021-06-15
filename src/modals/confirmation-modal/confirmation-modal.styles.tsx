import { createUseStyles } from '../../styles/create-use-styles';

export const useConfirmModalStyles = createUseStyles(({ colors, typography }) => ({
  errorMessage: {
    ...typography.body17Semibold,
    textAlign: 'center',
    color: colors.destructive
  }
}));
