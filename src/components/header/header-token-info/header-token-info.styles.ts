import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useHeaderTokenInfoStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    marginHorizontal: formatSize(10),
    flexDirection: 'row',
    alignItems: 'center'
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: formatSize(8)
  },
  title: {
    ...typography.numbersRegular17,
    color: colors.gray1
  },
  subtitle: {
    ...typography.numbersRegular11,
    color: colors.gray1
  }
}));
