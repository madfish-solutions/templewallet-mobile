import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useEarnScreenStubStyles = createUseStyles(({ colors, typography }) => ({
  numericInput: {
    ...typography.numbersMedium22,
    color: colors.black,
    flexGrow: 1,
    flexShrink: 1,
    padding: formatSize(12),
    backgroundColor: colors.input,
    borderRadius: formatSize(8),
    borderWidth: formatSize(1),
    borderColor: 'transparent'
  }
}));
