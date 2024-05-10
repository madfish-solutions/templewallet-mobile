import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useFarmingStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(16),
    borderBottomWidth: formatSize(1),
    borderColor: colors.lines
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  depositText: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  emptyListLoader: {
    marginTop: formatSize(100)
  },
  bottomLoader: {
    margin: formatSize(24)
  }
}));
