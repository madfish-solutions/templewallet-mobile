import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useAddContactModalStyles = createUseStyles(() => ({
  container: {
    marginTop: formatSize(16)
  }
}));
