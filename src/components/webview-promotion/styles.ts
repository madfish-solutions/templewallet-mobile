import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useWebviewPromotionStyles = createUseStylesMemoized(() => ({
  imageAdFrameWrapper: {
    borderRadius: formatSize(8)
  },
  imageAdFrame: {
    width: '100%',
    borderRadius: formatSize(8)
  },
  closeButton: {
    position: 'absolute',
    top: formatSize(6),
    right: formatSize(6),
    padding: formatSize(6)
  },
  textAdFrameContainer: {
    width: '100%',
    position: 'relative'
  },
  textAdFrame: {
    width: '100%',
    borderRadius: formatSize(10)
  },
  invisible: {
    opacity: 0
  },
  // https://stackoverflow.com/questions/54131875/screen-blinks-once-when-rendering-a-webview-on-android
  webView: {
    opacity: 0.99
  }
}));
