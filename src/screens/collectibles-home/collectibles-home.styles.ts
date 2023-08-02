import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCollectiblesHomeStyles = createUseStyles(({ colors, typography }) => ({
  headerCard: {
    paddingHorizontal: 0
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
  accountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: formatSize(16),
    marginBottom: formatSize(12)
  },
  profileContainer: {
    marginHorizontal: formatSize(16)
  },
  profileActions: {
    flexDirection: 'row',
    marginBottom: formatSize(16)
  },
  profileActionButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileText: {
    ...typography.tagline13Tag,
    color: colors.orange,
    marginLeft: formatSize(4),
    marginRight: formatSize(24)
  },
  socialsIcon: {
    width: formatSize(24),
    height: formatSize(24)
  },
  socialIconsBgColor: {
    backgroundColor: colors.gray4
  },
  collectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: formatSize(12)
  },
  collectionsLabel: {
    ...typography.body15Semibold,
    color: colors.black
  },
  collectionsContainer: {
    marginLeft: formatSize(4)
  },
  collection: {
    borderRadius: formatSize(10),
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    width: formatSize(56),
    height: formatSize(56),
    marginBottom: formatSize(4)
  },
  collectionBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: formatSize(12)
  },
  buttonDisabled: {
    ...typography.caption13Semibold,
    color: colors.disabled
  },
  collectionName: {
    width: formatSize(56),
    textAlign: 'center',
    color: colors.black,
    ...typography.caption10Regular
  },
  brokenImage: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(16),
    borderColor: colors.lines,
    borderBottomWidth: formatSize(0.5),
    borderTopWidth: formatSize(0.5),
    backgroundColor: colors.pageBG,
    height: formatSize(40)
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  handleStyle: {
    display: 'none'
  },
  socialLinks: {
    flexDirection: 'row'
  },
  bottomSheet: {
    backgroundColor: colors.pageBG
  },
  loader: {
    width: '100%',
    alignItems: 'center',
    marginTop: formatSize(12)
  }
}));
