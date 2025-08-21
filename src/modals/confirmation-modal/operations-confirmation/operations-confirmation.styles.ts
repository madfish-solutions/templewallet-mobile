import { DEFAULT_BORDER_WIDTH } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

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
  divider: {
    flexGrow: 1,
    borderBottomColor: colors.lines,
    borderBottomWidth: DEFAULT_BORDER_WIDTH
  }
}));
