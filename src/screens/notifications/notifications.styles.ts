import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useNotificationsStyles = createUseStyles(({ colors, typography }) => ({
  contentWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    padding: formatSize(18)
  },
  desctiption: {
    ...typography.caption13Regular,
    color: colors.gray1
  }
}));
