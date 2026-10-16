import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useAppMetadataConnectionViewStyles = createUseStyles(({ colors, typography }) => ({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  appContainer: {
    alignItems: 'center',
    flex: 1,
    minWidth: 0
  },
  nameText: {
    ...typography.caption13Semibold,
    color: colors.black,
    maxWidth: '100%',
    textAlign: 'center'
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: formatSize(36),
    height: formatSize(36),
    borderRadius: formatSize(16),
    backgroundColor: colors.orange10
  },
  connectionText: {
    ...typography.caption13Semibold,
    color: colors.gray1,
    textAlign: 'center'
  },
  descriptionText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    textAlign: 'center'
  }
}));
