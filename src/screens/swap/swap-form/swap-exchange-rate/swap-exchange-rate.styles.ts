import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useSwapExchangeRateStyles = createUseStyles(({ colors, typography }) => ({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: formatSize(12)
  },
  infoText: {
    ...typography.caption13Regular,
    lineHeight: formatTextSize(18),
    color: colors.gray1
  },
  infoValue: {
    ...typography.numbersRegular13,
    color: colors.black
  }
}));
