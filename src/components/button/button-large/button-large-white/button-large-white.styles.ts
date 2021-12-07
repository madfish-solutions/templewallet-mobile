import { white } from '../../../../config/styles';
import { createUseStylesConfig } from '../../../../styles/create-use-styles';
import { useButtonLargeSharedStyleConfig } from '../button-large.styles';

export const useButtonLargeWhiteStyleConfig = createUseStylesConfig(({ colors }) => ({
  ...useButtonLargeSharedStyleConfig(),
  activeColorConfig: {
    titleColor: white,
    backgroundColor: colors.orange
  }
}));
