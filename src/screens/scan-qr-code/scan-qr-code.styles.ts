import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useScanQrCodeStyles = createUseStyles(() => ({
  camera: {
    flex: 1
  },
  disclaimer: {
    paddingHorizontal: formatSize(16)
  },
  container: {
    flex: 1
  },
  emptyScreen: {
    paddingTop: formatSize(8),
    justifyContent: 'flex-end',
    flexDirection: 'column',
    flex: 1
  }
}));
