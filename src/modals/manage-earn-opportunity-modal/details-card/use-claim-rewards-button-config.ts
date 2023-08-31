import { useMemo } from 'react';

import { useButtonLargePrimaryStyleConfig } from 'src/components/button/button-large/button-large-primary/button-large-primary.styles';
import { formatSize } from 'src/styles/format-size';
import { useTypography } from 'src/styles/typography.context';
import { useColors } from 'src/styles/use-colors';

export const useClaimRewardsButtonConfig = () => {
  const basicConfig = useButtonLargePrimaryStyleConfig();
  const colors = useColors();
  const typography = useTypography();

  return useMemo(
    () => ({
      ...basicConfig,
      containerStyle: {
        ...basicConfig.containerStyle,
        height: formatSize(38)
      },
      titleStyle: {
        ...typography.tagline13Tag,
        letterSpacing: formatSize(-0.08),
        color: colors.white
      }
    }),
    [basicConfig, colors, typography]
  );
};
