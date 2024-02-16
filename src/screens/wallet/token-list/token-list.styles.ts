import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTokenListStyles = createUseStylesMemoized(({ colors, typography }) => ({
  contentContainerStyle: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: colors.pageBG
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
    paddingHorizontal: formatSize(8)
  },
  promotionItemBorder: {
    marginLeft: formatSize(16)
  },
  promotionItem: {
    width: '100%'
  },
  banner: {
    marginVertical: formatSize(12),
    marginHorizontal: formatSize(16)
  }
}));
