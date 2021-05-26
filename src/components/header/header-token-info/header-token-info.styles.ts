import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useHeaderTokenInfoStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    ...typography.numbersRegular17,
    color: colors.gray1,
    marginLeft: formatSize(8)
  }
}));
