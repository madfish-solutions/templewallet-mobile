import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCollectiblesHomeStyles = createUseStyles(({ colors, typography }) => ({
  screen: {
    flex: 1,
    flexDirection: 'column'
  },
  headerCard: {
    paddingHorizontal: 0,
    paddingBottom: formatSize(4)
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
    marginLeft: formatSize(16)
  },
  profileContainer: {
    paddingVertical: formatSize(12),
    marginHorizontal: formatSize(16)
  },
  collectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: formatSize(16),
    marginBottom: formatSize(12)
  },
  collectionsLabel: {
    ...typography.body15Semibold,
    color: colors.black
  },
  collectionsContainer: {
    marginLeft: formatSize(4)
  },
  buttonDisabled: {
    ...typography.caption13Semibold,
    color: colors.disabled
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
  bottomSheet: {
    backgroundColor: colors.pageBG
  },
  loader: {
    width: '100%',
    alignItems: 'center',
    marginTop: formatSize(12)
  }
}));

export const useCollectionButtonStyles = createUseStyles(({ colors, typography }) => ({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: formatSize(12)
  },
  logo: {
    width: formatSize(56),
    height: formatSize(56),
    marginBottom: formatSize(4)
  },
  image: {
    borderRadius: formatSize(10),
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    width: formatSize(56),
    height: formatSize(56)
  },
  brokenImage: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    width: formatSize(56),
    textAlign: 'center',
    color: colors.black,
    ...typography.caption10Regular
  }
}));

export const useCollectiblesHomeProfileStyles = createUseStyles(({ colors, typography }) => ({
  profileActions: {
    flexDirection: 'row'
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
  }
}));
