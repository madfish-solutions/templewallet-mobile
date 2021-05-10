import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useFormPasswordInputStyles = createUseStyles(() => ({
  view: {
    position: 'relative'
  },
  eyeButton: {
    position: 'absolute',
    top: formatSize(13),
    right: formatSize(48)
  }
}));
