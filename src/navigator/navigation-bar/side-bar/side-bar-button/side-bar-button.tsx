import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { formatSize } from 'src/styles/format-size';
import { conditionalStyle } from 'src/utils/conditional-style';

import { useNavigationBarButton } from '../../hooks/use-navigation-bar-button';
import { NavigationBarButton } from '../../interfaces/navigation-bar-button.interface';
import { useSideBarButtonStyles } from './side-bar-button.styles';

export const SideBarButton = memo<Omit<NavigationBarButton, 'iconWidth'>>(props => {
  const { label, iconName, focused, disabled = false, showNotificationDot = false } = props;

  const styles = useSideBarButtonStyles();
  const { color, colors, handlePress } = useNavigationBarButton(props);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        conditionalStyle(focused, { borderLeftColor: color }),
        conditionalStyle(disabled, { borderLeftColor: color })
      ]}
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
        <Icon name={iconName} size={formatSize(28)} color={color} />
      </View>
      <Divider size={formatSize(8)} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
});
