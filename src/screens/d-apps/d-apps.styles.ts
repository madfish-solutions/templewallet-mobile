import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useDAppsStyles = createUseStyles(({ colors, typography }) => ({
  searchInput: {
    marginTop: formatSize(12),
    marginBottom: formatSize(12)
  },
  wrapper: {
    marginTop: formatSize(12),
    marginBottom: formatSize(12),
    paddingHorizontal: formatSize(16)
  },
  text: {
    marginBottom: formatSize(12),
    color: colors.black,
    ...typography.body15Semibold
  },
  marginBottom: {
    marginBottom: formatSize(16)
  },
  blue: {
    backgroundColor: colors.blue
  },
  green: {
    backgroundColor: colors.kolibriGreen
  },
  flatListContentContainer: {
    paddingHorizontal: formatSize(16),
    paddingBottom: formatSize(16)
  },
  flatListColumnWrapper: {
    justifyContent: 'space-between'
  }
}));
