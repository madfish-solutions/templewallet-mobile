import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useLbDappStyles = createUseStyles(({ colors, typography }) => ({
  lineDivider: {
    width: '100%',
    borderBottomWidth: formatSize(0.5),
    borderColor: colors.lines
  },
  lbCoinContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  lbCoinText: {
    ...typography.numbersMedium15,
    color: colors.black,
    marginLeft: formatSize(8)
  },
  bottomLbContainer: {
    marginTop: formatSize(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  priceTitle: {
    ...typography.tagline11Tag,
    color: colors.gray2,
    textTransform: 'uppercase'
  },
  priceValue: {
    ...typography.numbersMedium20,
    color: colors.black
  },
  chartIconWrapper: {
    width: formatSize(28),
    height: formatSize(28),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(10),
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    flex: 1
  }
}));
