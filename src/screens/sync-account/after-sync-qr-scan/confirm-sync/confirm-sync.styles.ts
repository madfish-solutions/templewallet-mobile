import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useConfirmSyncStyles = createUseStyles(({ colors, typography }) => ({
  checkboxContainer: {
    marginLeft: formatSize(4)
  },
  checkboxText: {
    ...typography.body15Semibold,
    color: colors.black
  },
  passwordBlocked: {
    paddingBottom: formatSize(24),
    paddingTop: formatSize(20),
    paddingLeft: formatSize(4),
    color: colors.destructive
  }
}));
