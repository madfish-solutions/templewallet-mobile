import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useBakerRewardItemStyles = createUseStyles(({ colors, typography }) => ({
  rewardContainer: {
    paddingVertical: formatSize(16),
    paddingRight: formatSize(16),
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
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
  rowAlignCenter: {
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
  detailsButtonText: {
    ...typography.caption13Semibold,
    color: colors.orange,
    marginRight: formatSize(6)
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start'
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
  },
  accountPkh: {
    height: formatSize(24)
  }
}));
