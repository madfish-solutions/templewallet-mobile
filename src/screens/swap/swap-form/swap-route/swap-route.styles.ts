import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSwapRouteStyles = createUseStyles(({ colors }) => ({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  row: {
    flexDirection: 'row'
  },
  flex: {
    justifyContent: 'space-between'
  },
  infoText: {
    fontSize: formatSize(14),
    lineHeight: formatSize(18),
    color: colors.gray1
  },
  infoValue: {
    color: colors.black
  },
  mb8: {
    marginBottom: formatSize(8)
  },
  mb12: {
    marginBottom: formatSize(12)
  }
}));
