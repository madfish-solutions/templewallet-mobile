import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useActivityStyles = createUseStyles(() => ({
  inputContainer: {
    marginVertical: formatSize(8),
    marginHorizontal: formatSize(16)
  }
}));
