import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useBridgeNotesStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    gap: formatSize(4)
  },
  text: {
    ...typography.caption13Regular,
    color: colors.gray1
  }
}));
