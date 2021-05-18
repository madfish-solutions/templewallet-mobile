import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useWelcomeLogoStyles = createUseStyles(() => ({
  imageView: {
    alignItems: 'center',
    marginBottom: '30%'
  },
  image: {
    width: formatSize(200),
    height: formatSize(64)
  }
}));
