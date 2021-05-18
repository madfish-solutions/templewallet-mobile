import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useWelcomeStyles = createUseStyles(({ colors, typography }) => ({
  view: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: formatSize(16)
  },
  headerView: {},
  imageView: {
    alignItems: 'center',
    marginBottom: '30%'
  },
  headerTitle: {
    ...typography.caption13Semibold,
    textAlign: 'right',
    color: colors.black,
    paddingLeft: formatSize(70)
  },
  headerTitleQuotes: {
    ...typography.headline4Bold22,
    color: colors.gray3
  },
  image: {
    width: formatSize(200),
    height: formatSize(64)
  },
  headerSecondTitle: {
    ...typography.tagline11Tag,
    marginTop: formatSize(8),
    color: colors.gray1,
    textAlign: 'right'
  }
}));
