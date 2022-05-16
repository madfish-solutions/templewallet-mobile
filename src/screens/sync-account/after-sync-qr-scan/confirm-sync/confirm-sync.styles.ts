import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useConfirmSyncStyles = createUseStyles(({ colors, typography }) => ({
  buttonContainer: {
    marginTop: 'auto',
    borderTopWidth: formatSize(0.5),
    borderColor: colors.lines,
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    paddingHorizontal: formatSize(16),
    backgroundColor: colors.pageBG
  },
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
