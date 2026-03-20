import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useWalletAddressStyles = createUseStyles(({ colors, typography }) => ({
  iconContainer: {
    width: formatSize(22),
    height: formatSize(22),
    marginLeft: formatSize(2),
    paddingHorizontal: formatSize(4),
    paddingVertical: formatSize(2),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(4)
  },
  pkhWrapper: {
    flexDirection: 'row'
  },
  domainNameContainer: {
    paddingHorizontal: formatSize(4),
    paddingVertical: formatSize(2),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(4)
  },
  domainNameText: {
    ...typography.numbersRegular15,
    color: colors.blue
  }
}));
