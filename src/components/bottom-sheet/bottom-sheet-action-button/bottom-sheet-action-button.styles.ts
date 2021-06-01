import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useBottomSheetActionButtonStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    height: formatSize(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.navigation,
    borderColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  title: {
    ...typography.body17Regular,
    color: colors.orange
  }
}));
