import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCollectibleHistoryIconStyles = createUseStyles(({ colors }) => ({
  root: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue10,
    borderRadius: formatSize(4)
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: formatSize(4),
    justifyContent: 'center',
    alignItems: 'center'
  },
  loader: {
    position: 'absolute'
  }
}));
