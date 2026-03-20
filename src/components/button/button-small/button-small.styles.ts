import { black } from 'src/config/styles';
import { createUseStylesConfig } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

import { ButtonStyleConfig } from '../button-style.config';

export const useButtonSmallSharedStyleConfig = createUseStylesConfig<Omit<ButtonStyleConfig, 'activeColorConfig'>>(
  ({ typography }) => ({
    containerStyle: {
      ...generateShadow(1, black),
      height: formatSize(26),
      paddingHorizontal: formatSize(8),
      borderRadius: formatSize(17)
    },
    titleStyle: {
      ...typography.tagline13Tag
    }
  })
);
