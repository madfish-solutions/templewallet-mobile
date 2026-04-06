import { createUseStylesConfig } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSeedPhraseWordGivenStyles = createUseStylesConfig(({ colors, typography }) => ({
  container: {
    alignItems: 'center'
  },
  wordWrapper: {
    borderRadius: formatSize(8),
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    alignItems: 'center',
    justifyContent: 'center',
    height: formatSize(48),
    width: formatSize(108)
  },
  title: {
    ...typography.caption13Regular,
    color: colors.gray1
  },
  word: {
    ...typography.body15Semibold,
    color: colors.gray1
  }
}));
