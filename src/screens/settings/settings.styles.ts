import { step, white } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';

export const useSettingsStyles = createUseStyles(({ colors, typography }) => ({
  darkAppearanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  testContainer: {
    height: step,
    backgroundColor: colors.navigation
  },
  description: {
    ...typography.numbersRegular13,
    marginBottom: 2 * step
  },
  accountItem: {
    backgroundColor: white,
    padding: step,
    marginBottom: step,
    borderRadius: step
  }
}));
