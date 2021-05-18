import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useButtonsStyles = createUseStyles(() => ({
  buttonsContainer: {
    zIndex: 1,
    position: 'absolute',
    justifyContent: 'space-between',
    flexDirection: 'row',
    bottom: formatSize(8),
    right: formatSize(8)
  }
}));
