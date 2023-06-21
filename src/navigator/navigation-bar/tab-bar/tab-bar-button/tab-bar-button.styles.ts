import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useTabBarButtonStyles = createUseStyles(({ typography }) => ({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: formatSize(4)
  },
  iconContainer: {
    position: 'relative'
  },
  notificationDotIcon: {
    position: 'absolute',
    zIndex: 1,
    top: formatSize(2),
    right: formatSize(4)
  },
  label: {
    ...typography.caption10Regular
  }
}));
