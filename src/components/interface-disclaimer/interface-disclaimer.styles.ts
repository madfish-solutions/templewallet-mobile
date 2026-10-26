import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useInterfaceDisclaimerStyles = createUseStyles(({ typography, colors }) => ({
  text: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  description: {
    ...typography.caption13Regular,
    color: colors.black
  },
  link: {
    paddingBottom: formatSize(1),
    borderBottomWidth: formatSize(1),
    borderBottomColor: colors.black
  },
  linkText: {
    ...typography.caption13Semibold,
    color: colors.black
  }
}));
