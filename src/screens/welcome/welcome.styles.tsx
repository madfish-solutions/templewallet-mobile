import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useWelcomeStyles = createUseStyles(() => ({
  view: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: formatSize(16)
  }
}));
