import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const useSwapStyles = createUseStyles(({ colors }) => ({
  container: {
    padding: formatSize(16)
  },
  swapIconContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoRow: {
    flexDirection: 'row'
  },
  smartRouteContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  submitButton: {
    borderTopWidth: formatSize(0.5),
    borderColor: colors.lines,
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    paddingHorizontal: formatSize(8),
    backgroundColor: colors.pageBG
  },
  smartRouteStyle: {
    ...generateShadow(1, colors.black),
    padding: formatSize(8),
    borderRadius: formatSize(10),
    borderColor: colors.gray1,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  swapInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  smartRouteLastTokenStyle: {
    marginLeft: formatSize(-12)
  },
  smartRouteLastTokenPlaceholderStyle: {
    marginLeft: formatSize(-2)
  },
  smartRouteTextDescription: {
    color: colors.gray2,
    fontSize: formatSize(12)
  },
  infoContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: formatSize(12)
  },
  infoText: {
    fontSize: formatSize(14),
    lineHeight: formatSize(18),
    color: colors.gray1
  },
  infoValue: {
    color: colors.black
  }
}));
