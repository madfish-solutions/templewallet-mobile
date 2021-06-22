import { createUseStyles } from '../../../../../styles/create-use-styles';
import { formatSize } from '../../../../../styles/format-size';

export const useAppMetadataViewStyles = createUseStyles(({ colors, typography }) => ({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  appContainer: {
    alignItems: 'center'
  },
  nameText: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  templeLogoContainer: {
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
