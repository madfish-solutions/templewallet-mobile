import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useStyledPasswordInputStyles = createUseStyles(() => ({
  view: {
    position: 'relative'
  },
  eyeButton: {
    position: 'absolute',
    top: formatSize(13),
    right: formatSize(42)
  }
}));
