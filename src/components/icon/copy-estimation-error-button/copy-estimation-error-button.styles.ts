import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useCopyEstimationErrorButtonStyles = createUseStyles(() => ({
  container: {
    padding: formatSize(4),
    borderRadius: formatSize(4)
  }
}));
