import { createUseStyles } from '../../../../../styles/create-use-styles';
import { formatSize } from '../../../../../styles/format-size';

export const useBakerRewardItemStyles = createUseStyles(({ colors, typography }) => ({
  rewardContainer: {
    paddingVertical: formatSize(16),
    paddingRight: formatSize(16),
    borderBottomWidth: formatSize(0.5),
    borderColor: colors.lines
  },
  rewardBasicInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rightContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  bakerAlias: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  cycleInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cellContainer: {
    marginTop: formatSize(8)
  },
  cellTitle: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  cellValueText: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  detailsButtonText: {
    ...typography.caption13Semibold,
    color: colors.destructive,
    marginRight: formatSize(6)
  },
  detailTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row'
  },
  column: {
    flexDirection: 'column'
  },
  detailTitle: {
    ...typography.caption13Regular,
    color: colors.black
  },
  textGreen: {
    ...typography.numbersRegular15,
    color: colors.adding
  },
  textRed: {
    ...typography.numbersRegular15,
    color: colors.destructive
  },
  textBlue: {
    ...typography.numbersRegular15,
    color: colors.blue
  },
  textBlack: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  textGray: {
    ...typography.body15Regular,
    color: colors.gray1
  }
}));
