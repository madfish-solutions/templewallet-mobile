import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useManageFarmingPoolModalStyles = createUseStyles(({ colors, typography }) => ({
  background: {
    backgroundColor: colors.pageBG,
    flex: 1,
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(16)
  },
  depositPrompt: {
    ...typography.caption13Regular,
    letterSpacing: formatSize(-0.08),
    color: colors.gray1
  }
}));
