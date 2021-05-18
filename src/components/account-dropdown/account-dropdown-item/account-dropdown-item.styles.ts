import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useAccountDropdownItemStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    flexDirection: 'row'
  },
  icon: {
    width: formatSize(44),
    height: formatSize(44),
    backgroundColor: colors.orange,
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    borderWidth: formatSize(1)
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: formatSize(10)
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
  }
}));
