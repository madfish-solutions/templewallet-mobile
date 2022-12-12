import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useRightSwipeViewStyles = createUseStyles(() => ({
  rootContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    maxWidth: formatSize(141)
  }
}));
