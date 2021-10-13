import { black } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const useSelectPercentageButtonStyles = createUseStyles(({ colors, typography }) => ({
  buttonWrapper: {
    paddingHorizontal: formatSize(8),
    paddingVertical: formatSize(4),
    marginHorizontal: formatSize(4),
    backgroundColor: colors.white,
    borderRadius: formatSize(14),
    ...generateShadow(1, black)
  },
  valueStyle: {
    ...typography.tagline13Tag,
    color: colors.orange
  },
  activeButton: {
    paddingHorizontal: formatSize(6),
    paddingVertical: formatSize(2),
    borderWidth: formatSize(2),
    borderColor: colors.orange,
    borderStyle: 'solid'
  }
}));
