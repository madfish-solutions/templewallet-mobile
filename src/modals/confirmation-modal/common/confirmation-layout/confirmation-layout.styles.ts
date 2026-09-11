import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';

export const useConfirmationLayoutStyles = createUseStyles(({ colors, typography }) => ({
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
