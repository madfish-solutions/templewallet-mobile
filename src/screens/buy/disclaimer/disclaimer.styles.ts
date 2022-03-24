import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useDisclaimerStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    paddingTop: formatSize(8),
    paddingLeft: formatSize(8),
    paddingRight: formatSize(32),
    paddingBottom: formatSize(8),
    backgroundColor: colors.peach10,
    borderRadius: formatSize(8)
  },
  header: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  body: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
