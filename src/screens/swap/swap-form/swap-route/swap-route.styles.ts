import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useSwapRouteStyles = createUseStylesMemoized(({ colors, typography }) => ({
  title: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: formatSize(12)
  },
  flex: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoText: {
    ...typography.caption13Regular,
    lineHeight: formatTextSize(18),
    color: colors.gray1
  },
  infoValue: {
    ...typography.numbersRegular13,
    color: colors.black
  },
  mb8: {
    marginBottom: formatSize(8)
  }
}));
