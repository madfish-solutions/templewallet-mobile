import { createUseStylesConfig } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

import { ButtonStyleConfig } from '../button-style.config';

export const useButtonLargeSharedStyleConfig = createUseStylesConfig<Omit<ButtonStyleConfig, 'activeColorConfig'>>(
  ({ colors, typography }) => ({
    containerStyle: {
      height: formatSize(50),
      borderRadius: formatSize(10),
      borderWidth: formatSize(2)
    },
    titleStyle: {
      ...typography.body17Semibold
    },
    iconStyle: {
      size: formatSize(24),
      marginRight: formatSize(8)
    },
    disabledColorConfig: {
      titleColor: colors.white,
      backgroundColor: colors.disabled
    }
  })
);
