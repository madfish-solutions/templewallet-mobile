import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useImportWalletFromKeystoreFileStyles = createUseStyles(({ colors, typography }) => ({
  seedPhraseInputContainer: {
    flexGrow: 1
  },
  checkboxText: {
    ...typography.body15Semibold,
    color: colors.black,
    marginLeft: formatSize(6),
    flexShrink: 1
  }
}));
