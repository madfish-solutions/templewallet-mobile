import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useAllNetworksOptionsStyles = createUseStylesMemoized(({ colors, typography }) => ({
  container: {
    gap: formatSize(8)
  },
  option: {
    ...generateShadow(1, black),
    backgroundColor: colors.cardBG,
    padding: formatSize(12),
    paddingRight: formatSize(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(4),
    borderRadius: formatSize(10)
  },
  optionIcon: {
    margin: formatSize(5)
  },
  optionName: {
    ...typography.body15Semibold,
    color: colors.black,
    flex: 1
  }
}));
