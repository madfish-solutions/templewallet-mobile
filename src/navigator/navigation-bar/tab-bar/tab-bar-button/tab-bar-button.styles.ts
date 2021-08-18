import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useTabBarButtonStyles = createUseStyles(({ typography }) => ({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: formatSize(4)
  },
  label: {
    ...typography.caption11Regular,
    // TODO: replace this with correct typography name
    fontSize: 10
  }
}));
