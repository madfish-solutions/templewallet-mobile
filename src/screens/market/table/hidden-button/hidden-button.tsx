import React, { FC } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { AnalyticsEventProperties } from '../../../../types/analytics-event-properties.type';
import { AnalyticsEventCategory } from '../../../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../../../utils/analytics/use-analytics.hook';
import { useHiddenButtonStyles } from './hidden-button.styles';

interface Props {
  iconName: IconNameEnum;
  text: string;
  fill?: string;
  testID?: string;
  disabled?: boolean;
  testIDProperties?: AnalyticsEventProperties;
  onPress: () => void;
}

export const HiddenButton: FC<Props> = ({
  text,
  iconName,
  fill,
  disabled = false,
  testID,
  testIDProperties,
  onPress
}) => {
  const colors = useColors();
  const styles = useHiddenButtonStyles();
  const { trackEvent } = useAnalytics();

  const fillColor = disabled ? colors.disabled : fill;
  const iconStyles = disabled ? styles.iconDisabled : styles.iconActive;
  const textStyles = disabled ? styles.textDisabled : styles.textActive;
  const rootStyles = disabled ? styles.rootContainerDisabled : styles.rootContainerActive;

  const handlePress = () => {
    trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);
    onPress();
  };

  return (
    <TouchableOpacity style={[styles.rootContainer, rootStyles]} onPress={handlePress} disabled={disabled}>
      <Icon size={formatSize(24)} name={iconName} fill={fillColor} style={{ ...styles.icon, ...iconStyles }} />
      <Text style={[styles.text, textStyles]}>{text}</Text>
    </TouchableOpacity>
  );
};
