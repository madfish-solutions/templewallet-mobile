import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useImportAccountStyles = createUseStyles(({ colors, typography }) => ({
  checkboxContainer: {
    marginLeft: formatSize(4)
  },
  checkboxText: {
    ...typography.body15Semibold,
    color: colors.black
  },
  labelContainer: {
    marginHorizontal: formatSize(6)
  },
  labelWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  labelText: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  link: {
    ...typography.caption11Semibold,
    color: colors.blue,
    textDecorationLine: 'underline'
  }
}));
