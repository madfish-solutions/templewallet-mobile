import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useMultichainTokenListItemStyles = createUseStyles(({ colors, typography }) => ({
  gasTokenContainer: {
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines,
    backgroundColor: colors.pageBG,
    marginHorizontal: formatSize(16)
  },
  balanceSplitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: formatSize(40),
    marginBottom: formatSize(8),
    gap: formatSize(8)
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(4),
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    borderRadius: formatSize(56),
    paddingHorizontal: formatSize(12),
    paddingVertical: formatSize(8),
    backgroundColor: colors.cardBG
  },
  balancePillText: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  balancePillTextNumber: {
    ...typography.numbersRegular11,
    color: colors.black
  },
  infoButton: {
    marginLeft: 'auto'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: formatSize(16),
    paddingVertical: formatSize(8),
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines,
    backgroundColor: colors.pageBG
  },
  gasTokenSubcontainer: {
    marginHorizontal: 0,
    borderBottomWidth: 0
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1
  },
  infoContainer: {
    justifyContent: 'center',
    flexShrink: 1
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(2)
  },
  symbolText: {
    ...typography.numbersRegular17,
    lineHeight: formatSize(22),
    color: colors.black
  },
  tokenNameText: {
    ...typography.numbersRegular13,
    lineHeight: formatSize(18),
    color: colors.gray1
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    maxWidth: formatSize(150)
  },
  balanceText: {
    ...typography.numbersRegular17,
    lineHeight: formatSize(22),
    color: colors.black
  },
  valueText: {
    ...typography.numbersRegular13,
    lineHeight: formatSize(18),
    color: colors.gray1
  }
}));
