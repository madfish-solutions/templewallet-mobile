import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useBottomSheetActionButtonStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    height: formatSize(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.navigation,
    borderColor: colors.lines,
    borderBottomWidth: formatSize(1)
  },
  title: {
    ...typography.body17Regular,
    color: colors.orange
  },
  disabled: {
    backgroundColor: colors.pageBG
  },
  disabledTitle: {
    color: colors.gray4
  }
}));
