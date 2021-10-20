import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useDAppsStyles = createUseStyles(() => ({
  container: {
    paddingLeft: formatSize(16),
    paddingBottom: formatSize(16)
  }
}));
