import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useSliderStyles = createUseStyles(() => ({
  slider: {
    height: formatSize(28)
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}));
