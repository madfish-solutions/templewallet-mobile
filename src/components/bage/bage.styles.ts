import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useBageStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    overflow: 'hidden',
    backgroundColor: colors.blue,
    borderTopLeftRadius: formatSize(10),
    borderBottomRightRadius: formatSize(10)
  },
  text: {
    ...typography.caption11Semibold,
    color: 'white',
    lineHeight: formatTextSize(18),
    letterSpacing: formatSize(-0.08),
    paddingHorizontal: formatSize(12)
  }
}));
