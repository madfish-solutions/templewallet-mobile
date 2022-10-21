import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useBackupSheet = createUseStyles(({ colors, typography }) => ({
  header: {
    ...typography.body17Semibold,
    color: colors.black,
    textAlign: 'center'
  },
  sheetContainer: {
    padding: formatSize(16)
  },
  text: {
    ...typography.caption13Regular,
    color: colors.gray1,
    textAlign: 'center'
  },
  divider: {
    borderBottomWidth: formatSize(0.5),
    borderColor: colors.lines
  },
  accountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}));
