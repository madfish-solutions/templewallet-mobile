import { isIOS } from 'src/config/system';
import { createUseStylesConfigMemoized, createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useWithdrawFormStyles = createUseStylesMemoized(({ colors, typography }) => ({
  tokenSelectorTitle: {
    ...typography.body15Semibold,
    lineHeight: formatTextSize(20),
    letterSpacing: formatSize(-0.24),
    color: colors.black
  },
  tokenSelector: {
    backgroundColor: colors.cardBG,
    borderWidth: 0,
    margin: 0
  }
}));

export const useAssetAmountInputStylesConfig = createUseStylesConfigMemoized(({ colors }) => ({
  balanceText: {
    color: colors.black
  },
  amountInput: {
    backgroundColor: colors.disabled,
    borderRightWidth: formatSize(1),
    marginBottom: isIOS ? formatSize(0.5) : 0
  },
  inputContainer: {
    backgroundColor: colors.lines,
    borderWidth: 0
  }
}));
