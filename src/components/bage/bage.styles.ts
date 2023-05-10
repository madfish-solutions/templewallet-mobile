import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useBageStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    overflow: 'hidden',
    backgroundColor: colors.blue,
    borderTopLeftRadius: formatSize(10),
    borderBottomRightRadius: formatSize(10)
  },
  text: {
    ...typography.caption13Semibold,
    color: 'white',
    lineHeight: formatSize(18),
    letterSpacing: formatSize(-0.08),
    paddingHorizontal: formatSize(12)
  }
}));
