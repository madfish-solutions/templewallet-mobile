import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTopUpOptionStyles = createUseStyles(({ colors, typography }) => ({
  content: {
    padding: formatSize(16),
    alignItems: 'center'
  },
  divider: {
    width: '100%',
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines,
    marginVertical: formatSize(12.5)
  },
  actionText: {
    ...typography.body15Semibold,
    letterSpacing: formatSize(-0.24),
    color: colors.black
  },
  disabled: {
    color: colors.disabled
  }
}));
