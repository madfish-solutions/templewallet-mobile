import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useSwapExchangeRateStyles = createUseStyles(({ colors }) => ({
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
    fontSize: formatSize(14),
    lineHeight: formatSize(18),
    color: colors.gray1
  },
  infoValue: {
    color: colors.black
  },
  promotionText: {
    color: colors.adding
  }
}));
