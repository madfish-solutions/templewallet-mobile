import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { iosCardShadow } from 'src/styles/shadows';

export const useOperationPreviewCardStyles = createUseStyles(({ colors }) => ({
  container: {
    boxShadow: iosCardShadow,
    padding: formatSize(8),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1
  },
  hashContainer: {
    flexShrink: 0
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}));
