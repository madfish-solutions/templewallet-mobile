import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useStyledPasswordInputStyles = createUseStyles(() => ({
  view: {
    position: 'relative'
  },
  eyeButton: {
    position: 'absolute',
    top: formatSize(13),
    right: formatSize(48)
  }
}));
