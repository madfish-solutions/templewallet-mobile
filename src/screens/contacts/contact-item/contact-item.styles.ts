import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useContactItemStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: formatSize(20),
    paddingVertical: formatSize(8),
    borderBottomWidth: formatSize(1),
    borderColor: colors.lines
  },
  accountContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  accountContainerData: {
    flexShrink: 1,
    marginLeft: formatSize(10),
    justifyContent: 'space-between'
  },
  actions: {
    flexDirection: 'row'
  },
  name: {
    ...typography.numbersRegular15,
    color: colors.black
  }
}));
