import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useCollectiblesHomeStyles = createUseStyles(({ colors, typography }) => ({
  headerCard: {
    paddingHorizontal: 0
  },
  widthPaddingHorizontal: {
    paddingHorizontal: formatSize(16)
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  walletNavigationButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  walletNavigationButtonText: {
    ...typography.tagline13Tag,
    color: colors.peach,
    textTransform: 'uppercase'
  },
  descriptionText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    paddingVertical: formatSize(8)
  },
  accountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: formatSize(16)
  },
  profileContainer: {
    flexDirection: 'row',
    marginHorizontal: formatSize(24),
    marginTop: formatSize(16),
    marginBottom: formatSize(20)
  },
  socialsIcon: {
    backgroundColor: colors.gray4,
    width: formatSize(24),
    height: formatSize(24)
  },
  createProfile: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  createProfileText: {
    ...typography.tagline13Tag,
    color: colors.orange,
    marginLeft: formatSize(4),
    marginRight: formatSize(24)
  },
  collectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: formatSize(16)
  },
  collection: {
    borderRadius: formatSize(10),
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    width: formatSize(56),
    height: formatSize(56),
    marginHorizontal: formatSize(4),
    marginBottom: formatSize(4)
  },
  collectionBlock: {
    marginHorizontal: formatSize(2),
    marginTop: formatSize(12),
    marginBottom: formatSize(16),
    height: formatSize(64),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  collectionsLabel: {
    ...typography.body15Semibold
  },
  disabled: {
    ...typography.caption13Semibold,
    color: colors.disabled
  },
  collectionName: {
    width: formatSize(56),
    textAlign: 'center',
    ...typography.caption10Regular
  },
  collectionsContainer: {
    marginLeft: formatSize(16)
  }
}));
