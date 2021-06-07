import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useActivityGroupItemStyles = createUseStyles(({ colors }) => ({
  container: {
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  upperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  exploreContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  lowerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
}));
