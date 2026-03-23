import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSaplingPreparationLoadingStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: formatSize(24),
    gap: formatSize(24)
  },
  text: {
    ...typography.caption11Regular,
    color: colors.gray1,
    textAlign: 'center'
  },
  promotionContainer: {
    paddingBottom: formatSize(16)
  }
}));
