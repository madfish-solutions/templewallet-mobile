import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useImportAccountStyles = createUseStyles(({ colors }) => ({
  container: {
    marginHorizontal: formatSize(20),
    marginVertical: formatSize(24)
  },
  seedPhraseInputContainer: {
    flexGrow: 1
  },
  submitButton: {
    borderTopWidth: formatSize(0.5),
    borderColor: colors.lines,
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    paddingHorizontal: formatSize(8),
    backgroundColor: colors.pageBG
  }
}));
