import { transparent } from 'src/config/styles';
import { createUseStyles, createUseStylesConfigMemoized } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useBridgeModalStyles = createUseStyles(() => ({
  swapButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: formatSize(16)
  },
  notes: {
    marginTop: formatSize(4)
  },
  disclaimerContainer: {
    marginTop: formatSize(16)
  }
}));

export const useSourceInputStylesConfig = createUseStylesConfigMemoized(() => ({
  footerContainer: {
    minHeight: formatTextSize(26),
    alignItems: 'flex-start'
  }
}));

export const useDestInputStylesConfig = createUseStylesConfigMemoized(({ colors }) => ({
  amountInput: {
    color: colors.black,
    backgroundColor: colors.input
  },
  inputContainer: {
    backgroundColor: colors.input,
    borderColor: transparent
  }
}));
