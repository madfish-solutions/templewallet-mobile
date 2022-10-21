import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useQuoteStyles = createUseStyles(({ colors, typography }) => ({
  text: {
    ...typography.caption13Semibold,
    color: colors.black,
    paddingHorizontal: formatSize(28),
    textAlign: 'center',
    letterSpacing: -1
  },
  textQuotes: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  author: {
    ...typography.caption11Regular,
    color: colors.gray1,
    textAlign: 'center'
  }
}));
