import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { typography } from 'src/styles/typography';

export const useHeaderCardActionButtonsStyles = createUseStyles(() => ({
  buttonContainer: {
    flex: 0.4
  },
  actionButtonTitle: {
    ...typography.caption13Semibold,
    letterSpacing: formatSize(-0.08)
  }
}));
