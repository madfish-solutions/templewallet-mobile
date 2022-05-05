import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useCreateNewPasswordStyles = createUseStyles(({ colors, typography }) => ({
  checkboxContainer: {
    marginLeft: formatSize(4)
  },
  removeMargin: {
    marginBottom: formatSize(-20)
  },
  submitButton: {
    borderTopWidth: formatSize(0.5),
    borderColor: colors.lines,
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    paddingHorizontal: formatSize(8),
    backgroundColor: colors.pageBG
  },
  checkboxText: {
    ...typography.body15Semibold,
    color: colors.black
  }
}));
