import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useErrorBoundaryContentStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    padding: formatSize(16),
    alignItems: 'center'
  },
  header: {
    ...typography.body20Regular,
    textAlign: 'center',
    marginBottom: formatSize(4),
    color: colors.destructive
  },
  errorText: {
    ...typography.caption13Regular,
    textAlign: 'center',
    marginBottom: formatSize(16),
    color: colors.destructive
  }
}));
