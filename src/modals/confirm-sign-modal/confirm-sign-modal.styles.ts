import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useConfirmSignModalStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    paddingHorizontal: formatSize(0)
  },
  label: {
    marginTop: formatSize(4),
    marginBottom: formatSize(8)
  },
  grid: {
    paddingHorizontal: formatSize(16)
  },
  line: {
    width: '100%',
    marginBottom: formatSize(16),
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  segmentControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: formatSize(12),
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  segmentTitle: {
    ...typography.body15Semibold,
    color: colors.gray1
  },
  payload: {
    ...typography.numbersMedium13,
    color: colors.black
  }
}));
