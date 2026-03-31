import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useReceiveModalStyles = createUseStyles(({ colors, typography }) => ({
  rootContainer: {
    paddingVertical: formatSize(16),
    paddingHorizontal: formatSize(0)
  },
  shieldedContentContainer: {
    paddingHorizontal: 0
  },
  page: {
    alignItems: 'center'
  },
  pagerContainer: {
    flexGrow: 0
  },
  tokenContainer: {
    flexDirection: 'row',
    marginBottom: formatSize(26),
    gap: formatSize(4)
  },
  iconContainer: {
    width: formatSize(22),
    height: formatSize(22),
    marginLeft: formatSize(8),
    paddingHorizontal: formatSize(4),
    paddingVertical: formatSize(2),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(4)
  },
  pkhWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tokenInfoContainer: {
    justifyContent: 'center'
  },
  tokenSymbol: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  tokenName: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  addressTitle: {
    ...typography.body15Semibold,
    color: colors.black
  },
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.cardBG,
    borderRadius: formatSize(16),
    paddingVertical: formatSize(16),
    paddingHorizontal: formatSize(12)
  },
  publicKeyHashContainer: {
    alignSelf: 'stretch',
    padding: formatSize(12),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(8)
  },
  publicKeyHash: {
    ...typography.body17Regular,
    color: colors.blue
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: formatSize(16)
  },
  dot: {
    width: formatSize(8),
    height: formatSize(8),
    borderRadius: formatSize(4)
  },
  dotActive: {
    backgroundColor: colors.orange
  },
  dotInactive: {
    backgroundColor: colors.gray3
  },
  warningContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.peach10,
    borderRadius: formatSize(8),
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(12),
    gap: formatSize(8)
  },
  warningIcon: {
    fontSize: formatSize(18),
    color: colors.orange
  },
  warningText: {
    ...typography.caption13Regular,
    color: colors.black,
    flex: 1
  }
}));
