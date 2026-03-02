import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useManageAccountsStyles = createUseStyles(() => ({
  segmentControlContainer: {
    padding: formatSize(2),
    marginHorizontal: formatSize(16)
  }
}));
