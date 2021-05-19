import { createUseStylesConfig } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useButtonLinkStyles = createUseStylesConfig(({ colors, typography }) => ({
  containerStyle: {
    flex: 0,
    height: formatSize(17),
    borderRadius: formatSize(17)
  },
  titleStyle: {
    ...typography.tagline11Tag,
    textDecorationLine: 'underline'
  },
  activeColorConfig: {
    titleColor: colors.orange,
    backgroundColor: 'transparent'
  }
}));
