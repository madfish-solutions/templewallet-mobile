import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

const ICON_SIZE = formatSize(40);
const BADGE_SIZE = formatSize(16);

export const useMultichainTokenListItemStyles = createUseStyles(({ colors, typography }) => ({
  gasTokenContainer: {
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines,
    backgroundColor: colors.pageBG
  },
  containerNoBorder: {
    borderBottomWidth: 0
  },
  balanceSplitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: formatSize(16),
    paddingTop: formatSize(4),
    paddingBottom: formatSize(8),
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
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(10),
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines,
    backgroundColor: colors.pageBG
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1
  },
  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE
  },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BADGE_SIZE / 2,
    borderWidth: formatSize(0.8),
    borderColor: colors.lines,
    backgroundColor: colors.pageBG
  },
  infoContainer: {
    justifyContent: 'center',
    flexShrink: 1
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  symbolText: {
    ...typography.numbersRegular17,
    color: colors.black
  },
  networkText: {
    ...typography.numbersRegular13,
    color: colors.gray1
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    maxWidth: formatSize(150)
  },
  balanceText: {
    ...typography.numbersRegular17,
    color: colors.black
  },
  valueText: {
    ...typography.numbersRegular13,
    color: colors.gray1
  }
}));
