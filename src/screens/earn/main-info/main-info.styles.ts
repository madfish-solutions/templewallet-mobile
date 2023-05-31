import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useMainInfoStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    padding: formatSize(16)
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: formatSize(8),
    marginBottom: formatSize(16)
  },
  card: {
    paddingVertical: formatSize(12),
    paddingHorizontal: formatSize(8),
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    borderWidth: formatSize(1)
  },
  deposit: {
    flex: 1
  },
  netApy: {
    minWidth: formatSize(128)
  },
  titleText: {
    ...typography.tagline11Tag,
    color: colors.gray2,
    marginBottom: formatSize(4)
  },
  valueText: {
    ...typography.numbersMedium22
  }
}));
