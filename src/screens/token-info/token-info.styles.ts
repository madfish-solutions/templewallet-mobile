import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTokenInfoStyles = createUseStyles(({ colors, typography }) => ({
  contentContainerStyle: {
    paddingTop: formatSize(16)
  },
  addressContainer: {
    padding: formatSize(12),
    borderRadius: formatSize(8),
    backgroundColor: colors.blue10
  },
  addressText: {
    ...typography.body17Regular,
    color: colors.blue
  }
}));
