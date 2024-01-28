import { createUseStylesConfig } from '../../../../styles/create-use-styles';
import { useButtonLargeSharedStyleConfig } from '../button-large.styles';

export const useButtonLargePrimaryStyleConfig = createUseStylesConfig(({ colors }) => ({
  ...useButtonLargeSharedStyleConfig(),
  activeColorConfig: {
    titleColor: colors.white,
    backgroundColor: colors.orange
  },
  disabledColorConfig: {
    titleColor: colors.white,
    backgroundColor: colors.disabled
  }
}));
