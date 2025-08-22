import { DEFAULT_BORDER_WIDTH } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useActivityGroupItemStyles = createUseStyles(({ colors }) => ({
  container: {
    marginLeft: formatSize(16),
    borderBottomColor: colors.lines,
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
    paddingRight: formatSize(16)
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
  },
  accountPkh: {
    height: formatSize(24)
  }
}));
