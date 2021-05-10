import { step } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useReceiveBottomSheetStyles = createUseStyles(({ colors, typography }) => ({
  rootContainer: {
    alignItems: 'center',
    paddingVertical: 4 * step
  },
  tokenContainer: {
    flexDirection: 'row',
    marginBottom: formatSize(24)
  },
  tokenInfoContainer: {
    justifyContent: 'center'
  },
  tokenSymbol: {
    ...typography.numbersRegular15
  },
  tokenName: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  addressTitle: {
    ...typography.body15Semibold,
    marginTop: formatSize(24),
    marginBottom: formatSize(8)
  },
  publicKeyHash: {
    ...typography.body17Regular,
    color: colors.blue,
    padding: formatSize(12),
    backgroundColor: colors.blue10,
    borderRadius: step,
    marginBottom: formatSize(24)
  },
  buttonsContainer: {
    flexDirection: 'row'
  }
}));
