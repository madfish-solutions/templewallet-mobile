import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useErrorBoundaryContentStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: formatSize(16),
    backgroundColor: colors.pageBG
  },
  contentWrapper: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerContent: {
    alignItems: 'center',
    marginTop: 0,
    maxWidth: formatSize(280)
  },
  icon: {
    marginBottom: formatSize(8)
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
  },
  errorSubText: {
    ...typography.caption13Regular,
    textAlign: 'center',
    marginBottom: 0,
    color: colors.destructive
  },
  buttonsRow: {
    width: '100%',
    marginTop: formatSize(32),
    marginBottom: formatSize(24),
    maxWidth: formatSize(222),
    gap: formatSize(16)
  },
  retryButton: {
    backgroundColor: colors.white,
    ...generateShadow(2, black),
    shadowRadius: 9,
    elevation: 6,
    height: formatSize(26),
    gap: formatSize(4),
    borderRadius: formatSize(17)
  },
  border: {
    borderTopWidth: formatSize(1),
    borderColor: colors.lines,
    backgroundColor: colors.navigation,
    paddingTop: formatSize(8)
  },
  disclaimerContainer: {
    paddingHorizontal: formatSize(16),
    marginBottom: formatSize(8)
  },
  revertButton: {
    paddingHorizontal: formatSize(16)
  },
  iconGap: {
    gap: formatSize(6)
  },
  footer: {
    marginBottom: formatSize(32),
    marginTop: 'auto',
    width: '100%'
  }
}));
