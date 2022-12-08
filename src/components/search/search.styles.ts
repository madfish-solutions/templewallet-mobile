import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useSearchStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchInput: {
    ...typography.caption11Regular,
    color: colors.black,
    height: formatSize(28),
    width: formatSize(128),
    paddingVertical: 0,
    paddingHorizontal: formatSize(12),
    backgroundColor: colors.input,
    borderRadius: formatSize(10)
  }
}));
