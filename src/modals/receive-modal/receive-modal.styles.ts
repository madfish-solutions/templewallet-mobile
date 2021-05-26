import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useReceiveModalStyles = createUseStyles(({ colors, typography }) => ({
  rootContainer: {
    alignItems: 'center',
    paddingVertical: formatSize(32)
  },
  tokenContainer: {
    flexDirection: 'row',
    marginBottom: formatSize(24)
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
    color: colors.black,
    marginTop: formatSize(24),
    marginBottom: formatSize(8)
  },
  publicKeyHash: {
    ...typography.body17Regular,
    color: colors.blue,
    padding: formatSize(12),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(8),
    marginBottom: formatSize(24)
  },
  buttonsContainer: {
    flexDirection: 'row'
  }
}));
