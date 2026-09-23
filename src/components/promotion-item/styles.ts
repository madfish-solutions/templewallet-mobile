import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { iosCardShadow } from 'src/styles/shadows';

export const usePromotionItemStyles = createUseStylesMemoized(({ colors }) => ({
  androidContainer: {
    overflow: 'hidden'
  },
  container: {
    position: 'relative',
    backgroundColor: colors.cardBG,
    borderRadius: formatSize(10),
    boxShadow: iosCardShadow
  },
  textAdLoadingContainer: {
    minHeight: formatSize(80)
  },
  imgAdLoadingContainer: {
    minHeight: formatSize(112)
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: colors.cardBG,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: formatSize(10)
  }
}));
