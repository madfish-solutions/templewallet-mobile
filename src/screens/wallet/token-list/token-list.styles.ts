import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useTokenListStyles = createUseStyles(({ colors, typography }) => ({
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
