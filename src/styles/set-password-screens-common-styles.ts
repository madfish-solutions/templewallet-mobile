import { createUseStyles } from './create-use-styles';
import { formatSize } from './format-size';

export const useSetPasswordScreensCommonStyles = createUseStyles(({ colors, typography }) => ({
  marginTopAuto: {
    marginTop: 'auto'
  },
  fixedButtonContainer: {
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
