import { createUseStylesConfig } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useSeedPhraseWordInputStyles = createUseStylesConfig(({ colors, typography }) => ({
  container: {
    alignItems: 'center'
  },
  wordInput: {
    ...typography.body15Semibold,
    width: formatSize(108),
    minHeight: formatSize(48),
    height: formatSize(48),
    paddingRight: formatSize(12)
  },
  centeredCursorInput: {
    textAlign: 'center'
  },
  title: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
