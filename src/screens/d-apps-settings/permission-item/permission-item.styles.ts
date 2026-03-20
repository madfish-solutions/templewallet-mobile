import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const usePermissionItemStyles = createUseStylesMemoized(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: formatSize(8),
    paddingBottom: formatSize(24),
    paddingRight: formatSize(16),
    borderBottomColor: colors.lines,
    borderBottomWidth: DEFAULT_BORDER_WIDTH
  },
  infoContainer: {
    flexDirection: 'row'
  },
  nameText: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  networkText: {
    ...typography.numbersRegular11,
    color: colors.gray2
  },
  networkValue: {
    ...typography.numbersRegular11,
    color: colors.gray1,
    textTransform: 'capitalize'
  },
  trashIcon: {
    marginTop: formatSize(8)
  }
}));
