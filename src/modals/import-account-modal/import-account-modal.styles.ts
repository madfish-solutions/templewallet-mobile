import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useImportAccountModalStyles = createUseStyles(() => ({
  container: {
    marginHorizontal: formatSize(20),
    marginVertical: formatSize(24)
  },
  seedPhraseInputContainer: {
    flexGrow: 1
  }
}));
