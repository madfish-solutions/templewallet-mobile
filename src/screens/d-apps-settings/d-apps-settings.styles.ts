import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useDAppsSettingsStyles = createUseStyles(() => ({
  contentContainerStyle: {
    paddingRight: 0
  },
  whiteContainer: {
    marginRight: formatSize(16)
  }
}));
