import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useBackupStyles = createUseStyles(({ typography, colors }) => ({
  infoContainer: {
    marginVertical: formatSize(18),
    marginHorizontal: formatSize(28),
    alignItems: 'center'
  },
  title: {
    ...typography.body17Semibold,
    color: colors.black,
    marginVertical: formatSize(12)
  },
  description: {
    ...typography.body15Regular,
    color: colors.gray1,
    textAlign: 'center'
  },
  actionButtonContainer: {
    height: formatSize(48),
    padding: formatSize(8),
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionButtonText: {
    ...typography.body17Semibold,
    color: colors.orange
  }
}));

export const useEraseCloudBackupButtonStyles = createUseStyles(({ typography, colors }) => ({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: formatSize(8)
  },
  text: {
    ...typography.tagline13Tag,
    color: colors.destructive,
    marginRight: formatSize(4)
  }
}));
