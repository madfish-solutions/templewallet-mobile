import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const usePasswordStrengthIndicatorStyles = createUseStyles(() => ({
  container: {
    marginTop: formatSize(16),
    marginBottom: formatSize(32)
  }
}));
