import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useLiquidityBakingDappStyles = createUseStyles(({ colors, typography }) => ({
  lineDivider: {
    width: '100%',
    borderBottomWidth: formatSize(0.5),
    borderColor: colors.lines
  },
  sectionHeaderText: {
    ...typography.body15Semibold,
    color: colors.gray1,
    padding: formatSize(12)
  },
  verticalLineDivider: {
    width: formatSize(1),
    height: formatSize(12),
    backgroundColor: colors.lines,
    marginHorizontal: formatSize(8)
  },
  lbCoinContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  accountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: formatSize(8)
  },
  accountActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    borderRadius: formatSize(8),
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    paddingVertical: formatSize(6),
    paddingHorizontal: formatSize(8),
    position: 'absolute',
    top: formatSize(8),
    right: formatSize(0)
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
    flex: 1,
    backgroundColor: colors.pageBG
  }
}));
