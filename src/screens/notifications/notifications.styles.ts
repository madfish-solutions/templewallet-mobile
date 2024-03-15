import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useNotificationsStyles = createUseStyles(() => ({
  contentContainer: {
    flex: 1,
    paddingBottom: formatSize(16)
  },
  ads: {
    margin: formatSize(16)
  }
}));
