import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useSettingsHeaderStyles = createUseStyles(({ colors, typography }) => ({
  headerContainer: {
    alignItems: 'center'
  },
  versionText: {
    ...typography.numbersStatus8,
    color: colors.gray1,
    marginVertical: formatSize(8)
  },
  socialsContainer: {
    flexDirection: 'row',
    marginBottom: formatSize(8)
  }
}));
