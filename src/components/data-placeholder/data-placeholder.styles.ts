import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useDataPlaceholderStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    margin: formatSize(40),
    alignItems: 'center'
  },
  text: {
    ...typography.caption13Regular,
    color: colors.gray1
  }
}));
