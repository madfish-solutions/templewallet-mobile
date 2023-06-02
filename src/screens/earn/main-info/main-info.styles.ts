import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useMainInfoStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    ...generateShadow(1, black),
    padding: formatSize(16),
    backgroundColor: colors.navigation
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: formatSize(16)
  },
  card: {
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(12),
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
    ...typography.numbersMedium22,
    color: colors.black
  },
  buttonContainer: {
    height: formatSize(38)
  }
}));
