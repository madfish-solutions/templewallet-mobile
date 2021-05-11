import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useStyledMnemonicInputStyles = createUseStyles(() => ({
  view: {
    position: 'relative'
  },
  eyeButton: {
    position: 'absolute',
    top: formatSize(13),
    right: formatSize(48)
  },
  buttonsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: formatSize(8),
    right: formatSize(8)
  },
  buttonMargin: {
    marginRight: formatSize(8)
  }
}));
