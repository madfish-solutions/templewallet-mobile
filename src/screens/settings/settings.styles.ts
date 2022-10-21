import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

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
  notificationCircle: {
    backgroundColor: colors.destructive,
    borderRadius: formatSize(9),
    justifyContent: 'center',
    alignItems: 'center',
    width: formatSize(18),
    height: formatSize(18)
  },
  notificationText: {
    ...typography.numbersRegular11,
    fontSize: formatSize(10),
    color: colors.white
  },
  logoutButtonText: {
    ...typography.tagline13Tag,
    color: colors.destructive,
    marginRight: formatSize(2)
  }
}));
