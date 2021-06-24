import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const usePermissionItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: formatSize(8),
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
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
  }
}));
