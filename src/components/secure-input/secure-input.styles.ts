import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { hexa } from '../../utils/style.util';

export const useSecureInputStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    position: 'relative',
    marginVertical: formatSize(8),
    marginHorizontal: formatSize(16)
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: formatSize(10),
    justifyContent: 'center'
  },
  keyboardContainer: {
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  letterContainer: {
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(10),
    backgroundColor: colors.cardBG,
    borderColor: colors.lines,
    borderWidth: formatSize(0.5)
  },
  letter: {
    color: colors.accentBG
  },
  input: {
    ...typography.body17Regular,
    color: colors.black,
    padding: formatSize(8),
    paddingLeft: formatSize(32),
    borderRadius: formatSize(10),
    backgroundColor: hexa('#8E8E93', 0.12)
  }
}));
