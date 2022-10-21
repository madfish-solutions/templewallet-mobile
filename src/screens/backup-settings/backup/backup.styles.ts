import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useBackupSettingsStyles = createUseStyles(({ colors, typography }) => ({
  rootContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: formatSize(28.5),
    paddingVertical: formatSize(16)
  },
  title: {
    ...typography.body17Semibold,
    color: colors.black
  },
  description: {
    ...typography.body15Regular,
    textAlign: 'center',
    color: colors.gray1
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: formatSize(16)
  },
  button: {
    ...typography.body17Semibold,
    color: colors.orange
  }
}));
