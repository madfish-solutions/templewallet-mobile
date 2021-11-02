import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { hexa } from '../../utils/style.util';

export const useSwapStyles = createUseStyles(({ colors, typography }) => ({
  swapActionIconStyle: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    marginVertical: formatSize(40)
  },
  boldText: {
    ...typography.body15Semibold,
    color: colors.black
  },
  regularText: {
    ...typography.caption13Regular,
    color: colors.gray1
  },
  regularNumbers: {
    ...typography.numbersRegular13,
    color: colors.black
  },
  horizontalWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconWrapper: {
    width: formatSize(28),
    height: formatSize(28),
    backgroundColor: hexa(colors.peach, 0.1),
    borderRadius: formatSize(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightSideWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  verticalMargin: {
    marginVertical: formatSize(6)
  },
  swapButton: {
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    paddingHorizontal: formatSize(8),
    backgroundColor: colors.white
  }
}));
