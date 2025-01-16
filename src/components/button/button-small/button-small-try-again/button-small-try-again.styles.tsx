import { createUseStylesConfig } from 'src/styles/create-use-styles';

import { useButtonSmallSharedStyleConfig } from '../button-small.styles';

export const useButtonSmallTryAgainStyles = createUseStylesConfig(({ colors }) => ({
  ...useButtonSmallSharedStyleConfig(),
  activeColorConfig: {
    titleColor: colors.white,
    backgroundColor: colors.destructive
  }
}));
