import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useImportAccountStyles = createUseStyles(({ colors, typography }) => ({
  checkboxContainer: {
    marginLeft: formatSize(4)
  },
  checkboxText: {
    ...typography.body15Semibold,
    color: colors.black
  }
}));
