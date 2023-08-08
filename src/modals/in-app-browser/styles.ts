import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useInAppBrowserStyles = createUseStyles(({ colors }) => ({
  externalBtn: {
    marginHorizontal: formatSize(16)
  },
  webView: {
    backgroundColor: colors.pageBG
  }
}));
