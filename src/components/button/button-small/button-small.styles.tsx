import { createUseStylesConfig } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useButtonSmallStyles = createUseStylesConfig(({ colors, typography }) => ({
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
