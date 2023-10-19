import { black } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';
import { generateShadow } from '../../../styles/generate-shadow';

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
