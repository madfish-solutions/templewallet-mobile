import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useDelegateDisclaimerStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    padding: formatSize(8),
    paddingRight: formatSize(12),
    paddingBottom: formatSize(12),
    borderRadius: formatSize(8),
    backgroundColor: colors.blue10
  },
  icon: {
    marginTop: formatSize(3)
  },
  title: {
    ...typography.caption13Semibold,
    color: colors.blue
  },
  text: {
    ...typography.caption13Regular,
    color: colors.black
  },
  content: {
    flexShrink: 1
  }
}));
