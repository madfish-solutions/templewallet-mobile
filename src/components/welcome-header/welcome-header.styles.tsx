import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useWelcomeHeaderStyles = createUseStyles(({ colors, typography }) => ({
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
  headerSecondTitle: {
    ...typography.tagline11Tag,
    marginTop: formatSize(8),
    color: colors.gray1,
    textAlign: 'right'
  }
}));
