import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useHeaderTitleStyles = createUseStyles(() => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: formatSize(4),
    marginRight: formatSize(4)
  },
  icons: {
    marginLeft: formatSize(18)
  }
}));
