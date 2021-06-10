import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useWelcomeStyles = createUseStyles(() => ({
  imageView: {
    marginTop: formatSize(108),
    marginBottom: formatSize(24),
    alignItems: 'center'
  },
  quoteView: {
    marginHorizontal: formatSize(4),
    alignItems: 'stretch'
  }
}));
