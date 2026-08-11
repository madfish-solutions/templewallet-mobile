import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCollectiblesHomeStyles = createUseStylesMemoized(({ colors, typography }) => ({
  screen: {
    flex: 1,
    flexDirection: 'column'
  },
  headerCard: {
    marginBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: colors.pageBG
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
    alignItems: 'center'
  },
  profileContainer: {
    paddingTop: formatSize(16)
  },
  collectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: formatSize(4)
  },
  collectionsLabel: {
    ...typography.body15Semibold,
    color: colors.black
  },
  collectionsContainer: {
    paddingTop: formatSize(8),
    paddingLeft: formatSize(4)
  },
  buttonDisabled: {
    ...typography.caption13Semibold,
    color: colors.disabled
  },
  toolbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: formatSize(12)
  },
  searchInputContainer: {
    flex: 1,
    marginHorizontal: 0
  },
  handleStyle: {
    display: 'none'
  },
  bottomSheet: {
    backgroundColor: colors.pageBG
  }
}));

export const useCollectiblesGridStyles = createUseStylesMemoized(() => ({
  loader: {
    width: '100%',
    alignItems: 'center',
    marginTop: formatSize(4),
    height: formatSize(36)
  }
}));

export const useCollectionButtonStyles = createUseStylesMemoized(({ colors, typography }) => ({
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
