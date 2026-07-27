import { DEFAULT_BORDER_WIDTH, black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useOperationsConfirmationStyles = createUseStyles(({ colors, typography }) => ({
  loadingMessage: {
    ...typography.body17Semibold,
    textAlign: 'center',
    color: colors.black
  },
  sectionTitle: {
    ...typography.body15Semibold,
    color: colors.black
  },
  accountCard: {
    ...generateShadow(1, black),
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(12),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG
  },
  divider: {
    flexGrow: 1,
    borderBottomColor: colors.lines,
    borderBottomWidth: DEFAULT_BORDER_WIDTH
  }
}));
