import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useNotificationCounterStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    justifyContent: 'center',
    alightItems: 'center',
    width: formatSize(18),
    height: formatSize(18),
    borderRadius: formatSize(9),
    backgroundColor: colors.destructive
  },
  text: {
    ...typography.numbersMedium11,
    color: colors.white,
    textAlign: 'center'
  }
}));
