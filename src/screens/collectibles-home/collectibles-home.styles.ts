import { generateShadow } from 'src/styles/generate-shadow';

import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useCollectiblesHomeStyles = createUseStyles(({ colors, typography }) => ({
  headerCard: {
    paddingHorizontal: 0,
    paddingBottom: 0
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
    flexDirection: 'row',
    marginHorizontal: formatSize(24),
    marginBottom: formatSize(20),
    marginTop: formatSize(4)
  },
  socialsIcon: {
    width: formatSize(24),
    height: formatSize(24)
  },
  socialIconsBgColor: {
    backgroundColor: colors.gray4
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
    ...typography.body15Semibold,
    color: colors.black
  },
  disabled: {
    ...typography.caption13Semibold,
    color: colors.disabled
  },
  collectionName: {
    width: formatSize(56),
    textAlign: 'center',
    color: colors.black,
    ...typography.caption10Regular
  },
  collectionsContainer: {
    marginLeft: formatSize(16)
  },
  brokenImage: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  nftTypeContainer: {
    flexDirection: 'row',
    marginHorizontal: formatSize(16),
    marginVertical: formatSize(8),
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.lines,
    borderRadius: formatSize(8)
  },
  NFTType: {
    alignItems: 'center',
    marginVertical: formatSize(2),
    borderRadius: formatSize(7),
    flex: 1
  },
  NFTtypeActive: {
    backgroundColor: colors.white,
    marginLeft: formatSize(2),
    ...generateShadow(3, 'black')
  },
  NFTtypeText: {
    color: colors.orange,
    paddingVertical: formatSize(3),
    ...typography.caption13Semibold
  },
  NFTtypeTextDisabled: {
    color: colors.gray3
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: formatSize(20),
    paddingVertical: formatSize(13),
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5),
    backgroundColor: colors.pageBG
  },
  checkboxText: {
    ...typography.caption11Regular,
    color: colors.gray1,
    marginBottom: formatSize(2)
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  centerIcon: {
    marginHorizontal: formatSize(20)
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
  }
}));
