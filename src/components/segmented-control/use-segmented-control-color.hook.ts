import { useAnimationInterpolate } from '../../hooks/use-animation-interpolate.hook';
import { useAnimationRef } from '../../hooks/use-animation-ref.hook';
import { useUpdateAnimation } from '../../hooks/use-update-animation.hook';
import { useColors } from '../../styles/use-colors';

export const useSegmentedControlColor = (isSelected: boolean, isDisabled: boolean) => {
  const colors = useColors();
  const animation = useAnimationRef();

  const color = useAnimationInterpolate(
    animation,
    {
      outputRange: [colors.black, colors.orange]
    },
    [colors]
  );

  useUpdateAnimation(animation, isSelected, { useNativeDriver: false });

  return isDisabled ? colors.gray3 : color;
};
