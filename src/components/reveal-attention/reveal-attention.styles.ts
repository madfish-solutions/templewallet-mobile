import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const useRevealAttentionStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, colors.black),
    flexDirection: 'row',
    padding: formatSize(8),
    borderRadius: formatSize(8),
    backgroundColor: colors.orange10
  },
  title: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  description: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
