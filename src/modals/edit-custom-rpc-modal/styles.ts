import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useStyles = createUseStyles(({ colors, typography }) => ({
  fullWidthBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: formatSize(8)
  },
  fullWidthBtnText: {
    ...typography.tagline13Tag,
    color: colors.destructive,
    marginLeft: formatSize(2)
  }
}));
