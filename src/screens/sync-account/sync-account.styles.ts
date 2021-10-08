import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useSyncAccountStyles = createUseStyles(({ colors, typography }) => ({
  titleContainer: {
    marginTop: formatSize(38),
    marginBottom: formatSize(28)
  },
  buttonContainer: {
    marginTop: 'auto',
    borderTopColor: colors.lines,
    borderTopWidth: formatSize(0.5),
    borderStyle: 'solid',
    paddingTop: formatSize(8),
    paddingBottom: formatSize(46)
  },
  title: {
    ...typography.body15Semibold,
    color: colors.black,
    marginHorizontal: formatSize(20),
    marginVertical: formatSize(12)
  },
  text: {
    ...typography.body15Semibold,
    color: colors.gray1,
    marginHorizontal: formatSize(20),
    marginBottom: formatSize(24)
  }
}));
