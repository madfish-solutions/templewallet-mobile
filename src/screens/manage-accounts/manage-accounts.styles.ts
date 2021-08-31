import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useManageAccountsStyles = createUseStyles(() => ({
  segmentControlContainer: {
    padding: formatSize(2),
    marginHorizontal: formatSize(16)
  }
}));
