import { useButtonLargePrimaryStyleConfig } from 'src/components/button/button-large/button-large-primary/button-large-primary.styles';
import { createUseStylesConfig } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useButtonPrimaryStyleConfig = createUseStylesConfig(({ typography }) => ({
  ...useButtonLargePrimaryStyleConfig(),
  containerStyle: {
    height: formatSize(38),
    borderRadius: formatSize(10),
    minWidth: '48%'
  },
  titleStyle: {
    ...typography.tagline13Tag
  }
}));
