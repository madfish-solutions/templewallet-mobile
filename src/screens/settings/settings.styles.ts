import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSettingsStyles = createUseStyles(({ colors, typography }) => ({
  upperContainer: {
    position: 'relative'
  },
  quoteContainer: {
    position: 'absolute',
    top: formatSize(-72),
    right: formatSize(4)
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: formatSize(8)
  },
  shevronContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  shevronText: {
    ...typography.caption13Semibold,
    color: colors.gray2
  },
  logoutButtonText: {
    ...typography.tagline13Tag,
    color: colors.destructive,
    marginRight: formatSize(2)
  }
}));
