import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useCreateAccountStyles = createUseStyles(({ colors, typography }) => ({
  checkboxContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    marginLeft: formatSize(4),
    marginBottom: formatSize(8)
  },
  checkboxText: {
    ...typography.body15Semibold,
    color: colors.black,
    marginLeft: formatSize(10)
  }
}));
