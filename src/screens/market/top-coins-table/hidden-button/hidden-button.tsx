import React, { FC } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { EmptyFn } from '../../../../config/general';
import { TestIdProps } from '../../../../interfaces/test-id.props';
import { formatSize } from '../../../../styles/format-size';
import { AnalyticsEventCategory } from '../../../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../../../utils/analytics/use-analytics.hook';
import { conditionalStyle } from '../../../../utils/conditional-style';

import { useHiddenButtonStyles } from './hidden-button.styles';

interface Props extends TestIdProps {
  iconName: IconNameEnum;
  text: string;
  disabled?: boolean;
  color?: string;
  onPress: EmptyFn;
}

export const HiddenButton: FC<Props> = ({
  text,
  iconName,
  disabled = false,
  color,
  testID,
  testIDProperties,
  onPress
}) => {
  const styles = useHiddenButtonStyles();
  const { trackEvent } = useAnalytics();

  const iconStyles = conditionalStyle(disabled, styles.iconDisabled, styles.iconActive);
  const textStyles = conditionalStyle(disabled, styles.textDisabled, styles.textActive);
  const rootStyles = conditionalStyle(disabled, styles.rootContainerDisabled, styles.rootContainerActive);

  const handlePress = () => {
    trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);
    onPress();
  };

  return (
    <TouchableOpacity style={[styles.rootContainer, rootStyles]} onPress={handlePress} disabled={disabled}>
      <Icon size={formatSize(24)} name={iconName} style={{ ...styles.icon, ...iconStyles }} color={color} />
      <Text style={[styles.text, textStyles]}>{text}</Text>
    </TouchableOpacity>
  );
};
