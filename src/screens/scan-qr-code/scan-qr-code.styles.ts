import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useScanQrCodeStyles = createUseStyles(() => ({
  camera: {
    height: '100%',
    width: '100%'
  },
  disclaimer: {
    paddingHorizontal: formatSize(16)
  },
  emptyScreen: {
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    justifyContent: 'flex-end',
    flexDirection: 'column',
    height: '100%'
  }
}));
