import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useTokenEquityValueStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    marginVertical: formatSize(16)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateText: {
    ...typography.tagline11Tag,
    color: colors.gray3,
    marginLeft: formatSize(2)
  },
  mainValueText: {
    ...typography.numbersMedium20,
    color: colors.black
  },
  additionalValueText: {
    ...typography.numbersRegular15,
    color: colors.gray1
  }
}));
