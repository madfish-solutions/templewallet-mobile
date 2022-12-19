import React, { FC } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { formatSize } from '../../../../styles/format-size';
import { AnalyticsEventCategory } from '../../../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../../../utils/analytics/use-analytics.hook';
import { useHiddenButtonStyles } from './hidden-button.styles';
import { TestIdProps } from "../../../../interfaces/test-id.props";

interface Props extends TestIdProps {
  iconName: IconNameEnum;
  text: string;
  disabled?: boolean;
  colorized?: boolean;
  onPress: () => void;
}

export const HiddenButton: FC<Props> = ({ text, iconName, disabled = false, colorized = false, testID, testIDProperties, onPress }) => {
  const styles = useHiddenButtonStyles();
  const { trackEvent } = useAnalytics();

  const iconStyles = disabled ? styles.iconDisabled : colorized ? styles.iconColorized : styles.iconUncolorized;
  const textStyles = disabled ? styles.textDisabled : styles.textActive;
  const rootStyles = disabled ? styles.rootContainerDisabled : styles.rootContainerActive;

  const handlePress = () => {
    trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);
    onPress();
  };

  return (
    <TouchableOpacity style={[styles.rootContainer, rootStyles]} onPress={handlePress} disabled={disabled}>
      <Icon size={formatSize(24)} name={iconName} style={{...styles.icon, ...iconStyles}} />
      <Text style={[styles.text, textStyles]}>{text}</Text>
    </TouchableOpacity>
  );
};
