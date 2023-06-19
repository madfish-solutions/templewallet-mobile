import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useBackupNotFoundStyles = createUseStyles(({ colors, typography }) => ({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  retryBtnContainer: {
    width: formatSize(105),
    marginTop: formatSize(16)
  },
  text: {
    ...typography.caption11Regular,
    color: colors.gray1
  }
}));
