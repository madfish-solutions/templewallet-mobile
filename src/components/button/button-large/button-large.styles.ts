import { step } from '../../../config/styles';
import { createUseStylesConfig } from '../../../styles/create-use-styles';
import { ButtonStyleConfig } from '../button-style.config';

export const useButtonLargeSharedStyleConfig = createUseStylesConfig<Omit<ButtonStyleConfig, 'activeColorConfig'>>(
  ({ colors, typography }) => ({
    containerStyle: {
      height: 6.25 * step,
      borderRadius: 1.25 * step,
      borderWidth: 0.25 * step
    },
    titleStyle: {
      ...typography.body17Semibold
    },
    iconStyle: {
      size: 3 * step,
      marginRight: step
    },
    disabledColorConfig: {
      titleColor: colors.white,
      backgroundColor: colors.disabled
    }
  })
);
