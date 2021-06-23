import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useWelcomeStyles = createUseStyles(() => ({
  imageView: {
    marginTop: formatSize(108),
    alignItems: 'center'
  }
}));
