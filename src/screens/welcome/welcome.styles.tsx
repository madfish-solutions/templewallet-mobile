import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useWelcomeStyles = createUseStyles(({ colors, typography }) => ({
  headerTitle: {
    ...typography.caption13Regular,
    alignText: 'right',
    color: colors.black
  },
  headerTitleQuotes: {
    ...typography.headline4Bold22,
    color: colors.gray3
  },
  headerSecondTitle: {
    ...typography.tagline11Tag,
    marginTop: formatSize(8),
    color: colors.gray1
  },
  afterButtonsTitle: {
    ...typography.caption13Regular,
    colors: colors.gray1
  }
}));
