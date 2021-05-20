import { step, white } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const useSettingsStyles = createUseStyles(({ colors, typography }) => ({
  actionsContainer: {
    ...generateShadow(1, colors.black),
    padding: formatSize(8),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG,
  },
  actionRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actionText: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  actionTextMargin: {
    marginLeft: formatSize(8)
  },
  darkAppearanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  accountItem: {
    backgroundColor: white,
    padding: step,
    marginBottom: step,
    borderRadius: step
  }
}));
