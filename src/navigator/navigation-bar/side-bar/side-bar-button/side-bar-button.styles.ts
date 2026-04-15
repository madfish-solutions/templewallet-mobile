import { transparent } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSideBarButtonStyles = createUseStyles(({ typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: formatSize(8),
    paddingHorizontal: formatSize(12),
    borderLeftWidth: formatSize(4),
    borderLeftColor: transparent
  },
  label: {
    ...typography.caption13Semibold
  },
  iconContainer: {
    position: 'relative'
  },
  notificationDotIcon: {
    position: 'absolute',
    zIndex: 1,
    top: formatSize(2),
    right: formatSize(4)
  }
}));
