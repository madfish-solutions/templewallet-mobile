import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useAttentionMessageStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    padding: formatSize(8),
    paddingRight: formatSize(12),
    borderRadius: formatSize(8),
    backgroundColor: colors.orange10
  },
  title: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  content: {
    flexShrink: 1
  }
}));
