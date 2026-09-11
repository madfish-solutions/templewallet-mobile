import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useDAppsSettingsStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    flex: 1,
    backgroundColor: colors.pageBG
  },
  list: {
    flex: 1
  },
  header: {
    paddingTop: formatSize(16),
    paddingHorizontal: formatSize(16),
    paddingBottom: formatSize(4),
    gap: formatSize(12)
  },
  sectionLabel: {
    ...typography.caption13Regular,
    lineHeight: formatSize(18),
    color: colors.gray1
  },
  listContent: {
    paddingTop: formatSize(8),
    paddingHorizontal: formatSize(16),
    paddingBottom: formatSize(24),
    gap: formatSize(12)
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center'
  }
}));
