import { createUseStyles } from '../../styles/create-use-styles';

export const useQuoteStyles = createUseStyles(({ colors, typography }) => ({
  text: {
    ...typography.caption13Semibold,
    color: colors.black,
    textAlign: 'center'
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
