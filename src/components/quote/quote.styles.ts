import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useQuoteStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    paddingHorizontal: formatSize(28)
  },
  text: {
    ...typography.caption13Semibold,
    color: colors.black,
    textAlign: 'center'
  },
  author: {
    ...typography.caption11Regular,
    color: colors.gray1,
    textAlign: 'center'
  }
}));
