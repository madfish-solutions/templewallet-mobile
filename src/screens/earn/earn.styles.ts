import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useEarnStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    paddingVertical: formatSize(12),
    paddingHorizontal: formatSize(20),
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
    color: colors.gray1,
    marginLeft: formatSize(5)
  }
}));
