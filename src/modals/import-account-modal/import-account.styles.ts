import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useImportAccountStyles = createUseStyles(() => ({
  container: {
    marginHorizontal: formatSize(20),
    marginVertical: formatSize(24)
  },
  seedPhraseInputContainer: {
    flexGrow: 1
  }
}));
