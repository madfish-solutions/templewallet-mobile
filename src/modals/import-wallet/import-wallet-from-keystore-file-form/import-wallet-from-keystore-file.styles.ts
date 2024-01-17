import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useImportWalletFromKeystoreFileStyles = createUseStyles(({ colors, typography }) => ({
  seedPhraseInputContainer: {
    flexGrow: 1
  },
  checkboxText: {
    ...typography.body15Semibold,
    color: colors.black,
    marginLeft: formatSize(6),
    flexShrink: 1
  },
  buttonsContainer: {
    paddingHorizontal: formatSize(8)
  },
  buttonBox: {
    flex: 0.475
  }
}));
