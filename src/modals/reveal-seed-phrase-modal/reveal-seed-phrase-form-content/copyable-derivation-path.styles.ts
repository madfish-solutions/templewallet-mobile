import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCopyableDerivationPathStyles = createUseStyles(() => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(16)
  },
  inputContainer: {
    flex: 1,
    position: 'relative'
  },
  input: {
    height: formatSize(48),
    minHeight: formatSize(48),
    paddingRight: formatSize(48)
  },
  copyButtonContainer: {
    position: 'absolute',
    top: formatSize(10),
    right: formatSize(8)
  }
}));
