import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useSwapRouteStyles = createUseStyles(({ colors, typography }) => ({
  flex: {
    flex: 1,
    justifyContent: 'space-between'
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
  mb12: {
    marginBottom: formatSize(12)
  }
}));
