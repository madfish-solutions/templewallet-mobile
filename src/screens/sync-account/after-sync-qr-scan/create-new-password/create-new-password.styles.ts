import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useCreateNewPasswordStyles = createUseStyles(({ colors }) => ({
  buttonContainer: {
    marginTop: 'auto',
    borderTopWidth: formatSize(0.5),
    borderColor: colors.lines,
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    paddingHorizontal: formatSize(16),
    backgroundColor: colors.pageBG
  }
}));
