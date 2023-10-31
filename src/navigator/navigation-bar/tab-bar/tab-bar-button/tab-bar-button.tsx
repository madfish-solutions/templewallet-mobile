import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { formatSize } from 'src/styles/format-size';
import { conditionalStyle } from 'src/utils/conditional-style';

import { useNavigationBarButton } from '../../hooks/use-navigation-bar-button';
import { NavigationBarButton } from '../../interfaces/navigation-bar-button.interface';
import { useTabBarButtonStyles } from './tab-bar-button.styles';

export const TabBarButton = memo<NavigationBarButton>(props => {
  const { label, iconName, iconWidth, disabled = false, showNotificationDot = false } = props;

  const styles = useTabBarButtonStyles();
  const { color, colors, handlePress } = useNavigationBarButton(props);

  return (
    <TouchableOpacity
      style={[styles.container, conditionalStyle(disabled, { borderLeftColor: color })]}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        {showNotificationDot && (
          <Icon
            name={IconNameEnum.NotificationDot}
            width={formatSize(9)}
            height={formatSize(9)}
            color={colors.navigation}
            style={styles.notificationDotIcon}
          />
        )}
        <Icon name={iconName} width={iconWidth} height={formatSize(28)} color={color} />
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
});
