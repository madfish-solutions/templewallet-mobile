import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useLpTokenIconStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    position: 'relative'
  },
  firstIcon: {
    marginRight: formatSize(16)
  },
  secondIcon: {
    position: 'absolute',
    left: formatSize(16)
  }
}));
