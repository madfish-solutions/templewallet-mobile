import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useTokenListStyles = createUseStyles(({ colors, typography }) => ({
  headerContainer: {
    height: formatSize(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: formatSize(16),
    paddingLeft: formatSize(28),
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  hideZeroBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  hideZeroBalanceText: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  addTokenButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: formatSize(8)
  },
  addTokenText: {
    ...typography.tagline13Tag,
    color: colors.orange,
    marginLeft: formatSize(2)
  }
}));
