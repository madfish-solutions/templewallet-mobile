import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useSyncInstructionsStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flex: 1,
    paddingTop: formatSize(16)
  },
  titleContainer: {
    paddingVertical: formatSize(12),
    paddingHorizontal: formatSize(20),
    borderBottomWidth: formatSize(1),
    borderBottomColor: colors.lines
  },
  title: {
    ...typography.body15Semibold,
    color: colors.black,
    lineHeight: formatTextSize(20)
  },
  stepsContainer: {
    paddingTop: formatSize(16)
  },
  stepContainer: {
    paddingHorizontal: formatSize(20),
    paddingVertical: formatSize(12),
    borderBottomWidth: formatSize(1),
    borderBottomColor: colors.lines
  },
  text: {
    ...typography.body15Semibold,
    color: colors.gray1,
    lineHeight: formatTextSize(20)
  },
  buttonsContainer: {
    paddingHorizontal: formatSize(8)
  },
  buttonBox: {
    flex: 0.475
  }
}));
