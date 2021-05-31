import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useMnemonicStyles = createUseStyles(() => ({
  container: {
    position: 'relative'
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: formatSize(8),
    right: formatSize(8)
  }
}));
