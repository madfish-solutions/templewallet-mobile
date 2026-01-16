import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSwapSettingsStyles = createUseStyles(({ colors, typography }) => ({
  contentWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    padding: formatSize(18)
  },
  desctiption: {
    ...typography.caption13Regular,
    color: colors.gray1
  }
}));
