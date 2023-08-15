import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useCollectibleIconStyles = createUseStyles(({ colors }) => ({
  root: {
    backgroundColor: colors.blue10
  },
  container: {
    borderRadius: formatSize(4),
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: formatSize(4),
    justifyContent: 'center',
    alignItems: 'center'
  }
}));
