import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useTopUpOptionStyles = createUseStyles(({ colors, typography }) => ({
  content: {
    padding: formatSize(16),
    alignItems: 'center'
  },
  divider: {
    width: '100%',
    borderBottomWidth: formatSize(0.5),
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
