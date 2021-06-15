import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const useAttentionMessageStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, colors.black),
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
