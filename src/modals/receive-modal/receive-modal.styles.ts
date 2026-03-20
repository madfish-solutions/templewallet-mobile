import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useReceiveModalStyles = createUseStyles(({ colors, typography }) => ({
  rootContainer: {
    alignItems: 'center',
    paddingVertical: formatSize(32)
  },
  tokenContainer: {
    flexDirection: 'row'
  },
  iconContainer: {
    width: formatSize(22),
    height: formatSize(22),
    marginLeft: formatSize(8),
    paddingHorizontal: formatSize(4),
    paddingVertical: formatSize(2),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(4)
  },
  pkhWrapper: {
    flexDirection: 'row'
  },
  tokenInfoContainer: {
    justifyContent: 'center'
  },
  tokenSymbol: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  tokenName: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  addressTitle: {
    ...typography.body15Semibold,
    color: colors.black
  },
  publicKeyHashContainer: {
    padding: formatSize(12),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(8)
  },
  publicKeyHash: {
    ...typography.body17Regular,
    color: colors.blue
  },
  buttonsContainer: {
    width: '100%'
  }
}));
