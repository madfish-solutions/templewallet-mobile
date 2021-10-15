import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useCreateNewPasswordStyles = createUseStyles(({ colors, typography }) => ({
  checkboxContainer: {
    marginLeft: formatSize(4)
  },
  checkboxText: {
    ...typography.body15Semibold,
    color: colors.black
  },
  alertDescription: {
    ...typography.caption13Regular,
    color: colors.black
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: formatSize(43)
  }
}));
