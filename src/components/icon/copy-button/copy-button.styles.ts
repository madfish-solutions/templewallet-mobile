import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useCopyButtonStyles = createUseStyles(({ colors }) => ({
  container: {
    padding: formatSize(4),
    borderRadius: formatSize(4),
    backgroundColor: colors.blue10
  }
}));
