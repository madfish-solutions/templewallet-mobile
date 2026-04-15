import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

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
