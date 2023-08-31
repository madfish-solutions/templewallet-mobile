import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useInAppBrowserStyles = createUseStylesMemoized(({ colors }) => ({
  externalBtn: {
    marginHorizontal: formatSize(16)
  },
  container: {
    flex: 1
  },
  scrollViewContentContainer: {
    flex: 1
  },
  webView: {
    flex: 1,
    backgroundColor: colors.pageBG,
    opacity: 0.99
  }
}));
