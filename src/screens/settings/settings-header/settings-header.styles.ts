import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';
import { generateShadow } from '../../../styles/generate-shadow';

export const useSettingsHeaderStyles = createUseStyles(({ colors, typography }) => ({
  headerCard: generateShadow(1, colors.black),
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
