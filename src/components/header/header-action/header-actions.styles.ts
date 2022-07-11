import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useHeaderTitleStyles = createUseStyles(() => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: formatSize(18)
  },
  icons: {
    marginLeft: formatSize(18)
  }
}));
