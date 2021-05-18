import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useAccountDropdownItemStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    flexDirection: 'row'
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
  publicKeyHash: {
    color: colors.blue,
    paddingHorizontal: formatSize(4),
    paddingVertical: formatSize(2),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(4),
    maxWidth: '40%'
  },
  balanceText: {
    ...typography.numbersRegular13,
    color: colors.black
  }
}));
