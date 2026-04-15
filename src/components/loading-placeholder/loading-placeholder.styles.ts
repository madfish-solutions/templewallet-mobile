import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useLoadingPlaceholderStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: formatSize(40),
    gap: formatSize(24)
  },
  text: {
    ...typography.caption13Regular,
    color: colors.gray1,
    textAlign: 'center'
  }
}));
