import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useBuyWithCreditCardStyles = createUseStyles(({ colors, typography }) => ({
  arrowContainer: {
    alignItems: 'center',
    width: '100%'
  },
  exchangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  exchangeRate: {
    ...typography.caption13Regular,
    color: colors.gray1,
    letterSpacing: formatSize(-0.08)
  },
  exchangeRateValue: {
    ...typography.caption13Regular,
    color: colors.black,
    letterSpacing: formatSize(-0.08)
  },
  limitsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: formatSize(8)
  },
  singleLimitView: {
    flexDirection: 'row'
  },
  limitLabel: {
    ...typography.caption11Regular,
    color: colors.gray1,
    letterSpacing: formatSize(0.07),
    marginRight: formatSize(4)
  },
  limitValue: {
    ...typography.numbersRegular11,
    color: colors.black,
    letterSpacing: formatSize(0.07)
  },
  paymentProviderItemContainer: {
    borderRadius: formatSize(10),
    borderWidth: formatSize(1),
    borderColor: colors.gray4
  },
  errorText: {
    ...typography.caption11Regular,
    marginTop: formatSize(8),
    color: colors.destructive,
    letterSpacing: formatSize(0.07)
  },
  paymentProviderDropdownContainer: {
    ...generateShadow(1, black),
    borderRadius: formatSize(10)
  }
}));
