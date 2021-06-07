import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useActivityStatusBadgeStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    borderRadius: formatSize(8),
    paddingVertical: formatSize(1.5),
    paddingHorizontal: formatSize(6)
  },
  text: {
    ...typography.numbersMedium11,
    color: colors.white,
    textTransform: 'uppercase'
  }
}));
