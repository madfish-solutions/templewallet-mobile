import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useInAppBrowserStyles = createUseStyles(({ colors }) => ({
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
    backgroundColor: colors.pageBG
  }
}));
