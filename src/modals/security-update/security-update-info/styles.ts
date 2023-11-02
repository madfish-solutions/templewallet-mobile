import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSecurityUpdateInfoStyles = createUseStylesMemoized(({ colors, typography }) => ({
  illustration: {
    marginLeft: formatSize(-16),
    marginRight: formatSize(-16)
  },
  header: {
    ...typography.body20Bold,
    color: colors.black,
    textAlign: 'center',
    textTransform: 'none'
  },
  description: {
    ...typography.body15Regular,
    color: colors.gray1,
    textAlign: 'center',
    letterSpacing: formatSize(-0.24)
  },
  mainContent: {
    flex: 1
  },
  disclaimerDescriptionText: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
