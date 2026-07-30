import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSettingsHeaderStyles = createUseStyles(({ colors, typography }) => ({
  headerContainer: {
    alignItems: 'center',
    gap: formatSize(8)
  },
  versionText: {
    ...typography.numbersStatus8,
    color: colors.gray1
  },
  socialsContainer: {
    flexDirection: 'row',
    marginBottom: formatSize(8),
    gap: formatSize(12)
  }
}));
