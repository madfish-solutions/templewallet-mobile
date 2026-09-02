import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useNetworkSelectStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    marginBottom: formatSize(16)
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: formatSize(12),
    paddingRight: formatSize(4)
  },
  logo: {
    marginRight: formatSize(4)
  },
  name: {
    ...typography.body17Semibold,
    color: colors.black,
    flex: 1
  }
}));
