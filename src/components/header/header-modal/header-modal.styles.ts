import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useHeaderModalStyles = createUseStyles(() => ({
  accountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: formatSize(8)
  }
}));
