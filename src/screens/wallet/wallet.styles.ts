import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useWalletStyles = createUseStyles(({ colors, typography }) => ({
  accountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  addTokenButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: formatSize(8)
  },
  addTokenText: {
    ...typography.tagline13Tag,
    color: colors.orange,
    marginLeft: formatSize(2)
  }
}));
