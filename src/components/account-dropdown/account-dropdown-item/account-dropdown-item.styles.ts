import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useAccountDropdownItemStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    flexDirection: 'row'
  },
  rootModal: {
    margin: formatSize(8)
  },
  infoContainer: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'space-between',
    marginLeft: formatSize(10)
  },
  smallInfoContainer: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    marginLeft: formatSize(4)
  },
  upperContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  upperContainerFullData: {
    justifyContent: 'space-between'
  },
  name: {
    ...typography.tagline13Tag,
    color: colors.black
  },
  lowerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  balanceText: {
    ...typography.numbersRegular13,
    color: colors.black
  },
  headerText: {
    ...typography.caption11Regular,
    color: colors.gray1,
    marginBottom: formatSize(2)
  },
  headerBoldText: {
    ...typography.numbersMedium15,
    color: colors.black
  },
  collectiblesData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: formatSize(5)
  },
  headerInfoColumn: {
    marginHorizontal: formatSize(8)
  },
  accountNameMargin: {
    marginLeft: formatSize(10)
  },
  image: {
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    borderWidth: formatSize(1),
    overflow: 'hidden',
    height: formatSize(76),
    width: formatSize(76)
  }
}));
