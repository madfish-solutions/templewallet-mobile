import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useErrorDisclaimerMessageStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    padding: formatSize(8),
    paddingRight: formatSize(12),
    borderRadius: formatSize(8),
    backgroundColor: colors.destructive
  },
  title: {
    ...typography.caption13Semibold,
    color: colors.white
  },
  content: {
    flexShrink: 1,
    color: colors.white
  }
}));
