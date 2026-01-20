import { StyleSheet } from 'react-native';

import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

const BUTTON_SIZE = formatSize(24);

export const useKoloCardWidgetModalStyles = createUseStylesMemoized(({ colors }) => ({
  menuButton: {
    marginLeft: formatSize(16),
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: colors.peach10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: colors.pageBG
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: formatSize(24)
  },
  errorText: {
    textAlign: 'center',
    color: colors.destructive
  },
  webView: {
    flex: 1
  },
  webViewHidden: {
    opacity: 0
  },
  menuActionButton: {
    flexDirection: 'row',
    height: formatSize(56)
  },
  logoutText: {
    color: colors.destructive
  }
}));
