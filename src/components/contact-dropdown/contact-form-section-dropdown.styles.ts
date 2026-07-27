import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useContactFormSectionDropdownStyles = createUseStyles(({ colors, typography }) => ({
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: formatSize(40),
    height: formatSize(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: formatSize(20),
    backgroundColor: colors.orange
  },
  avatarText: {
    ...typography.numbersRegular17,
    color: colors.white
  },
  info: {
    flex: 1,
    marginLeft: formatSize(8)
  },
  name: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  balance: {
    ...typography.numbersRegular13,
    color: colors.black,
    marginLeft: formatSize(8)
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: formatSize(2)
  },
  address: {
    ...typography.numbersRegular11,
    color: colors.gray1,
    marginLeft: formatSize(4)
  },
  accountContainer: {
    flex: 1,
    gap: formatSize(12)
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(8)
  },
  accountName: {
    ...typography.body15Semibold,
    flexShrink: 1,
    color: colors.black
  },
  accountBalance: {
    ...typography.numbersRegular15,
    flexGrow: 1,
    textAlign: 'right',
    color: colors.black
  },
  accountAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(8)
  },
  accountAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(2)
  },
  accountAddressText: {
    ...typography.caption13Regular,
    color: colors.blue
  }
}));
