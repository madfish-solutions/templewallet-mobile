import { useColors } from '../../../styles/use-colors';

export const useTabBarColor = (focused: boolean, disabled: boolean) => {
  const colors = useColors();

  let color = colors.gray1;
  focused && (color = colors.orange);
  disabled && (color = colors.disabled);

  return color;
};
