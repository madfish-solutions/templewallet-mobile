import { createUseStylesConfig } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useButtonMediumStyleConfig = createUseStylesConfig(({ colors, typography }) => ({
  containerStyle: {
    flex: 1,
    height: formatSize(40),
    borderRadius: formatSize(8)
  },
  titleStyle: {
    ...typography.tagline13Tag
  },
  iconStyle: {
    size: formatSize(16),
    marginRight: formatSize(2)
  },
  activeColorConfig: {
    titleColor: colors.orange,
    backgroundColor: colors.orange10
  },
  disabledColorConfig: {
    titleColor: colors.disabled,
    backgroundColor: colors.gray4
  }
}));
