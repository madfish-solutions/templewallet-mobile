import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useUtorgStyles = createUseStyles(({ colors, typography }) => ({
  exchangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: formatSize(0.5),
    borderColor: colors.lines,
    paddingBottom: formatSize(16),
    backgroundColor: colors.pageBG
  },
  exchangeRate: {
    ...typography.caption13Regular,
    color: colors.gray1
  },
  exchangeRateValue: {
    ...typography.numbersRegular13,
    color: colors.black
  }
}));
