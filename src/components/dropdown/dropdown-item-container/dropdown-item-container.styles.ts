import { generateShadow, step } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';

export const useDropdownItemContainerStyles = createUseStyles(({ colors }) => ({
  root: {
    padding: step,
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderWidth: 0.25 * step,
    borderRadius: step,
    ...generateShadow(colors.black)
  },
  rootMargin: {
    marginVertical: 0.5 * step
  },
  rootSelected: {
    borderColor: colors.orange
  }
}));
