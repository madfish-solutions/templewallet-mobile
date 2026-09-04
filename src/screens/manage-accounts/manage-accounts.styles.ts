import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useManageAccountsStyles = createUseStyles(() => ({
  segmentControlContainer: {
    padding: formatSize(2),
    marginHorizontal: formatSize(16),
    marginTop: formatSize(16),
    marginBottom: formatSize(28)
  },
  fixedContent: {
    zIndex: 1
  },
  fixedContentShadow: {
    boxShadow: '0px 8px 8px -8px rgba(0, 0, 0, 0.10)'
  }
}));
