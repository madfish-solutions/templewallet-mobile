import { createUseStylesConfig } from '../../../../styles/create-use-styles';
import { useButtonSmallSharedStyleConfig } from '../button-small.styles';

export const useButtonSmallSecondaryStyles = createUseStylesConfig(({ colors }) => ({
  ...useButtonSmallSharedStyleConfig(),
  activeColorConfig: {
    titleColor: colors.orange,
    backgroundColor: colors.cardBG
  }
}));
