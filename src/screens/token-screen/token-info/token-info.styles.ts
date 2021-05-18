import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useTokenInfoStyles = createUseStyles(({ colors, typography }) => ({
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
