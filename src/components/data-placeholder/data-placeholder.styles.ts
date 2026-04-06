import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useDataPlaceholderStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    margin: formatSize(40),
    marginBottom: formatSize(24),
    alignItems: 'center'
  },
  text: {
    ...typography.caption13Regular,
    color: colors.gray1,
    textAlign: 'center'
  },
  mb12: {
    marginBottom: formatSize(12)
  }
}));
