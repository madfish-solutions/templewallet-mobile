import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
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
    borderWidth: 0
  },
  tokenSelectorWrapper: {
    margin: formatSize(-2)
  }
}));

export const useAssetAmountInputStylesConfig = createUseStylesConfigMemoized(({ colors }) => ({
  balanceText: {
    color: colors.black
  },
  amountInput: {
    backgroundColor: colors.disabled,
    borderRightWidth: formatSize(1),
    marginBottom: isIOS ? DEFAULT_BORDER_WIDTH : 0
  },
  inputContainer: {
    backgroundColor: colors.lines,
    borderWidth: 0
  }
}));
