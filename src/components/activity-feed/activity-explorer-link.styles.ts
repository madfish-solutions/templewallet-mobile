import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useActivityExplorerLinkStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1
  },
  hashText: {
    ...typography.numbersRegular13,
    color: colors.blue
  },
  iconContainer: {
    marginLeft: formatSize(2)
  }
}));
