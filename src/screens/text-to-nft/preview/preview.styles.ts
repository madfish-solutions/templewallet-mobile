import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const usePreviewStyles = createUseStyles(() => ({
  root: {
    marginTop: formatSize(24),
    paddingHorizontal: formatSize(16)
  }
}));
