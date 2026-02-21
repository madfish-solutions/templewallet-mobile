import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

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
    flexDirection: 'row'
  }
}));
