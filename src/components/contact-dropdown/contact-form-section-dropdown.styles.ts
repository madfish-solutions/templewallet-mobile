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
  }
}));
