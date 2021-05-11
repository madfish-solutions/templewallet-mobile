import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useButtonSmallStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    width: 'auto',
    padding: formatSize(8),
    backgroundColor: colors.cardBG,
    borderRadius: formatSize(17)
  },
  title: {
    ...typography.tagline13Tag,
    color: colors.orange
  }
}));
