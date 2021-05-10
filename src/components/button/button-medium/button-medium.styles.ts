import { step } from '../../../config/styles';
import { createUseStylesConfig } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';
import { ButtonStyleConfig } from '../button-style.config';

export const useButtonMediumStyleConfig = createUseStylesConfig<ButtonStyleConfig>(({ colors, typography }) => ({
  containerStyle: {
    height: 5 * step,
    borderRadius: step
  },
  titleStyle: {
    ...typography.tagline13Tag
  },
  iconStyle: {
    size: 2 * step,
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
