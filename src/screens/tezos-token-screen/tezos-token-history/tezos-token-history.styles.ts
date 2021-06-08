import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useTezosTokenHistoryStyles = createUseStyles(({ colors, typography }) => ({
  delegateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: formatSize(12),
    paddingHorizontal: formatSize(8),
    borderRadius: formatSize(8),
    backgroundColor: colors.blue,
    marginHorizontal: formatSize(16)
  },
  delegateText: {
    ...typography.caption13Semibold,
    color: colors.white
  },
  apyText: {
    ...typography.numbersMedium15,
    color: colors.white
  }
}));
