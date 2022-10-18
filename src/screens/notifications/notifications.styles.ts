import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useNotificationsStyles = createUseStyles(({ colors }) => ({
  contentWrapper: {
    flex: 1,
    backgroundColor: colors.pageBG,
    paddingTop: formatSize(12)
  }
}));
