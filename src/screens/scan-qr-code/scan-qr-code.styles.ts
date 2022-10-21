import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useScanQrCodeStyles = createUseStyles(() => ({
  camera: {
    height: '100%',
    width: '100%'
  },
  disclaimer: {
    paddingHorizontal: formatSize(16)
  },
  emptyScreenAndroid: {
    position: 'relative',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    justifyContent: 'flex-end',
    flexDirection: 'column'
  },
  emptyScreen: {
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    justifyContent: 'flex-end',
    flexDirection: 'column',
    height: '100%'
  }
}));
