import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useCollectiblePropertiesStyles = createUseStyles(() => ({
  root: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  even: {
    marginRight: formatSize(8)
  }
}));
