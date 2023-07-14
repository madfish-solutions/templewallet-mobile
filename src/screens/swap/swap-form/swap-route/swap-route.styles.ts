import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

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
  },
  lbPoolWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: formatSize(8)
  },
  lbPoolDashWrapper: {
    width: formatSize(16),
    overflow: 'hidden'
  },
  lbPoolItem: {
    ...generateShadow(1, black),
    borderRadius: formatSize(10),
    padding: formatSize(6),
    backgroundColor: colors.cardBG,
    justifyContent: 'center',
    alignItems: 'center'
  }
}));
