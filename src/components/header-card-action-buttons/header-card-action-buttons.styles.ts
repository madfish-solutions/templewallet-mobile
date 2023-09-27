import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useHeaderCardActionButtonsStyles = createUseStyles(({ typography }) => ({
  buttonContainer: {
    flex: 1
  },
  actionButtonTitle: {
    ...typography.caption13Semibold,
    letterSpacing: formatSize(-0.08)
  }
}));
