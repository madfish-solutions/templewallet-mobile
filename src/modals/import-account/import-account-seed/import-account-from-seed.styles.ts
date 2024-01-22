import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useImportAccountFromSeedStyles = createUseStyles(() => ({
  seedPhraseInputContainer: {
    flexGrow: 1
  },
  buttonsContainer: {
    paddingHorizontal: formatSize(8)
  },
  flex: {
    flex: 1
  }
}));
