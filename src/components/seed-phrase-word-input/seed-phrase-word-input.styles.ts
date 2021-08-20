import { createUseStylesConfig } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useSeedPhraseWordInputStyles = createUseStylesConfig(({ colors, typography }) => ({
  container: {
    alignItems: 'center'
  },
  wordInput: {
    width: formatSize(108),
    minHeight: formatSize(48),
    height: formatSize(48),
    paddingRight: formatSize(4),
    paddingTop: formatSize(12),
    paddingBottom: formatSize(12),
    paddingLeft: formatSize(2),
    textAlign: 'center',
    ...typography.body15Semibold
  },
  title: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
