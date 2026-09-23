import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { iosCardShadow } from 'src/styles/shadows';

export const useWatchAssetConfirmationContentStyles = createUseStyles(({ colors, typography }) => ({
  preview: {
    gap: formatSize(24),
    alignItems: 'center'
  },
  tokenPreview: {
    gap: formatSize(8),
    alignItems: 'center'
  },
  tokenLabels: {
    gap: formatSize(2),
    alignItems: 'center'
  },
  tokenSymbol: {
    ...typography.numbersRegular17,
    lineHeight: formatSize(22),
    color: colors.black
  },
  tokenName: {
    ...typography.caption13Regular,
    lineHeight: formatSize(18),
    color: colors.gray1
  },
  tokenIcon: {
    padding: formatSize(2)
  },
  tokenDetails: {
    gap: formatSize(16),
    padding: formatSize(16),
    borderRadius: formatSize(10),
    boxShadow: iosCardShadow,
    backgroundColor: colors.cardBG,
    alignSelf: 'stretch'
  },
  tokenDetailsRow: {
    height: formatSize(20),
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'visible',
    flexDirection: 'row'
  },
  tokenDetailsRowLabel: {
    ...typography.caption13Regular,
    lineHeight: formatSize(18),
    color: colors.gray1
  },
  decimals: {
    ...typography.numbersRegular13,
    lineHeight: formatSize(18),
    color: colors.black
  },
  networkView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(4)
  },
  networkName: {
    ...typography.numbersRegular15,
    lineHeight: formatSize(20),
    color: colors.black
  }
}));
