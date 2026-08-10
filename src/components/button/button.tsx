import React, { FC, useMemo } from 'react';
import { Animated, StyleProp, Text, View, ViewStyle, ActivityIndicator } from 'react-native';

import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';
import { setTestID } from 'src/utils/test-id.utils';

import { Icon } from '../icon/icon';
import { IconV2 } from '../icon-v2';
import { SafeTouchableOpacity } from '../safe-touchable-opacity';

import { ButtonSharedProps } from './button-shared.props';
import { ButtonStyleConfig } from './button-style.config';
import { ButtonStyles } from './button.styles';

export interface ButtonProps<IconName extends string, Size extends number> extends ButtonSharedProps<IconName> {
  styleConfig: ButtonStyleConfig<Size>;
  isFullWidth?: boolean;
  textStyle?: StyleProp<ViewStyle>;
}

interface EssentialIconProps<IconName extends string, Size extends number> {
  name: IconName;
  size?: Size;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

// TODO: Get rid of ButtonHOC when Button is not used anymore
const ButtonHOC = <IconName extends string, Size extends number>(
  IconComponent: FC<EssentialIconProps<IconName, Size>>
): FC<ButtonProps<IconName, Size>> => {
  const Button: FC<ButtonProps<IconName, Size>> = ({
    title,
    iconName,
    disabled = false,
    styleConfig,
    textStyle,
    buttonStyle,
    style,
    isFullWidth = false,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    onPress,
    isLoading,
    testID,
    testIDProperties
  }) => {
    const {
      containerStyle,
      titleStyle,
      iconStyle,
      activeColorConfig,
      disabledColorConfig = activeColorConfig
    } = styleConfig;
    const iconTranslateY = iconStyle?.translateY;

    const {
      titleColor,
      iconColor = titleColor,
      backgroundColor,
      borderColor = backgroundColor
    } = disabled ? disabledColorConfig : activeColorConfig;

    const { trackEvent } = useAnalytics();

    const handlePress = () => {
      trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);

      return onPress !== undefined && onPress();
    };

    const icon = useMemo(() => {
      if (!iconName) {
        return null;
      }

      const staticIcon = (
        <IconComponent
          name={iconName}
          size={iconStyle?.size}
          color={iconColor}
          {...(isDefined(title) && { style: { marginRight: iconStyle?.marginRight } })}
        />
      );

      return isDefined(iconTranslateY) ? (
        <Animated.View style={{ transform: [{ translateY: iconTranslateY }] }}>{staticIcon}</Animated.View>
      ) : (
        staticIcon
      );
    }, [iconTranslateY, iconStyle?.size, iconStyle?.marginRight, iconColor, title, iconName]);

    return (
      <View style={[conditionalStyle(isFullWidth, ButtonStyles.container), style]}>
        <SafeTouchableOpacity
          disabled={disabled}
          style={[
            ButtonStyles.touchableOpacity,
            containerStyle,
            { backgroundColor, borderColor },
            { marginTop, marginRight, marginBottom, marginLeft },
            buttonStyle
          ]}
          onPress={handlePress}
          {...setTestID(testID)}
        >
          {icon}

          <Text style={[titleStyle, { color: titleColor }, textStyle]}>{title}</Text>

          {Boolean(isLoading) && (
            <View style={ButtonStyles.loader}>
              <ActivityIndicator size="small" />
            </View>
          )}
        </SafeTouchableOpacity>
      </View>
    );
  };

  return Button;
};

/** @deprecated Use ButtonV2 instead */
export const Button = ButtonHOC(Icon);

export const ButtonV2 = ButtonHOC(IconV2);
