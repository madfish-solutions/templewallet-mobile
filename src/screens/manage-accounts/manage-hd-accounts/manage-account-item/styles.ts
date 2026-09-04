import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useManageAccountItemStyles = createUseStyles(() => ({
  accountDetails: {
    gap: formatSize(16)
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}));
