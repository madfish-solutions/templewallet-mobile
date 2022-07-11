import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useLoadingPlaceholderStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    margin: formatSize(40),
    marginBottom: formatSize(24),
    alignItems: 'center'
  },
  text: {
    ...typography.caption13Regular,
    color: colors.gray1,
    textAlign: 'center'
  }
}));
