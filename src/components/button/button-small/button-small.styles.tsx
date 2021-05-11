import { createUseStylesConfig } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';
import { ButtonStyleConfig } from '../button-style.config';

export const useButtonSmallStyles = createUseStylesConfig<ButtonStyleConfig>(({ colors, typography }) => ({
  containerStyle: {
    flex: 0,
    paddingHorizontal: formatSize(8),
    height: formatSize(26),
    borderRadius: formatSize(17)
  },
  titleStyle: {
    ...typography.tagline13Tag
  },
  activeColorConfig: {
    titleColor: colors.orange,
    backgroundColor: colors.cardBG
  }
}));
