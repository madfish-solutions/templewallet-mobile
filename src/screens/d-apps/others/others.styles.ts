import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useOthersDAppStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    padding: formatSize(8)
  },
  container: {
    ...generateShadow(1, black),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG,
    flexDirection: 'row',
    alignItems: 'center',
    padding: formatSize(16)
  },
  text: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  logo: {
    width: formatSize(24),
    height: formatSize(24),
    borderRadius: formatSize(100)
  }
}));
