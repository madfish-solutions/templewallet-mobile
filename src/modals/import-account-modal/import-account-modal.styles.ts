import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useImportAccountModalStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    marginHorizontal: formatSize(20),
    marginVertical: formatSize(24)
  },
  title: {
    ...typography.body15Semibold,
    color: colors.black
  },
  text: {
    ...typography.caption13Regular,
    color: colors.gray1
  },
  seedPhraseInputContainer: {
    flexGrow: 1
  }
}));
