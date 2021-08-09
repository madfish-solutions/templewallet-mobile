import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useActionItemStyles = createUseStyles(({ typography, colors }) => ({
  container: {
    borderBottomWidth: formatSize(1),
    borderBottomColor: colors.lines
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: formatSize(4)
  },
  openedAccordionIcon: {
    transform: [{ rotate: '180deg' }]
  },
  title: {
    ...typography.caption13Regular,
    color: colors.black,
    flexShrink: 1
  },
  body: {
    padding: formatSize(4)
  }
}));
