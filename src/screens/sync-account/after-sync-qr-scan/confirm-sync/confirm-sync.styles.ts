import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useConfirmSyncStyles = createUseStyles(({ colors, typography }) => ({
  checkboxContainer: {
    marginLeft: formatSize(4)
  },
  removeMargin: {
    marginBottom: formatSize(-20)
  },
  checkboxText: {
    ...typography.body15Semibold,
    color: colors.black
  }
}));
