import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useQuoteStyles = createUseStyles(({ colors, typography }) => ({
  text: {
    ...typography.caption13Semibold,
    color: colors.black,
    textAlign: 'right',
    paddingLeft: formatSize(70)
  },
  textQuotes: {
    ...typography.headline4Bold22,
    color: colors.gray3
  },
  author: {
    ...typography.tagline11Tag,
    color: colors.gray1,
    textAlign: 'right'
  }
}));
