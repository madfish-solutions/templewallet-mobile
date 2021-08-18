import { transparent } from '../../../../config/styles';
import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

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
  }
}));
