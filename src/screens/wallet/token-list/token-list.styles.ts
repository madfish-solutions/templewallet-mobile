import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useTokenListStyles = createUseStyles(({ colors, typography }) => ({
  contentContainerStyle: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: colors.pageBG,
    paddingLeft: formatSize(8)
  },
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
  promotionItemWrapper: {
    paddingVertical: formatSize(12),
    borderBottomWidth: formatSize(0.5),
    borderBottomColor: colors.lines
  },
  promotionItem: {
    width: formatSize(359)
  }
}));
