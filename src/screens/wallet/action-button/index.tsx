import { memo } from 'react';
import { Circle, Svg } from 'react-native-svg';

import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { ActionButtonStyles } from './styles';

interface ActionButtonProps {
  iconName: IconNameV2Enum;
  isDotVisible?: boolean;
  testID?: string;
  onPress?: EmptyFn;
  onLongPress?: EmptyFn;
}

export const ActionButton = memo(({ iconName, isDotVisible, testID, onPress, onLongPress }: ActionButtonProps) => (
  <SafeTouchableOpacity
    onPress={onPress}
    onLongPress={onLongPress}
    delayLongPress={4000}
    style={ActionButtonStyles.iconContainer}
    testID={testID}
  >
    {isDotVisible && <Dot />}
    <IconV2 name={iconName} size={24} />
  </SafeTouchableOpacity>
));

const Dot = memo(() => {
  const notificationDotSize = formatSize(6.75);
  const notificationDotRadius = notificationDotSize / 2;
  const colors = useColors();

  return (
    <Svg
      height={notificationDotSize}
      width={notificationDotSize}
      viewBox={`0 0 ${notificationDotSize} ${notificationDotSize}`}
      style={ActionButtonStyles.notificationDotIcon}
    >
      <Circle
        cx={notificationDotRadius}
        cy={notificationDotRadius}
        r={notificationDotRadius}
        fill={colors.destructive}
      />
    </Svg>
  );
});
