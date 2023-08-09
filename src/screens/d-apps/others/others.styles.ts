import { black } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';
import { generateShadow } from '../../../styles/generate-shadow';

export const useOthersDAppStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: formatSize(16),
    borderRadius: formatSize(10),
    padding: formatSize(16),
    backgroundColor: colors.cardBG,
    ...generateShadow(1, black)
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
