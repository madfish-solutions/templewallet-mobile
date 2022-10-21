import React, { FC, useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { Icon } from '../../../../components/icon/icon';
import { IconComponent as IconComponentProps } from '../../../../components/icon/icon-component.interface';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { EmptyFn, emptyFn } from '../../../../config/general';
import { useIsSeedPhraseVerified } from '../../../../store/security/security-selectors';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { conditionalStyle } from '../../../../utils/conditional-style';
import { isDefined } from '../../../../utils/is-defined';
import { ScreensEnum, ScreensParamList } from '../../../enums/screens.enum';
import { useNavigation } from '../../../hooks/use-navigation.hook';
import { useTabBarButtonStyles } from './tab-bar-button.styles';

interface Props {
  label: string;
  iconName: IconNameEnum;
  iconWidth: number;
  routeName: ScreensEnum;
  focused: boolean;
  disabled?: boolean;
  params?: ScreensParamList[ScreensEnum.SwapScreen];
  IconComponent?: FC<IconComponentProps>;
  disabledOnPress?: EmptyFn;
}

export const TabBarButton: FC<Props> = ({
  label,
  iconName,
  iconWidth,
  routeName,
  focused,
  disabled = false,
  params,
  IconComponent,
  disabledOnPress = emptyFn
}) => {
  const colors = useColors();
  const styles = useTabBarButtonStyles();
  const { navigate } = useNavigation();
  const isVerified = useIsSeedPhraseVerified();

  const color = useMemo(() => {
    let value = colors.gray1;
    focused && (value = colors.orange);
    disabled && (value = colors.disabled);

    return value;
  }, [colors, focused, disabled]);

  const handlePress = () => {
    if (disabled) {
      disabledOnPress();
    } else {
      // @ts-ignore
      navigate(routeName, params);
    }
  };

  const isNotification = useMemo(() => {
    if (routeName === ScreensEnum.Settings) {
      return isVerified === false;
    }

    return false;
  }, [routeName]);

  return (
    <TouchableOpacity
      style={[styles.container, conditionalStyle(disabled, { borderLeftColor: color })]}
      onPress={handlePress}
    >
      {isDefined(IconComponent) ? (
        <IconComponent isNotification={isNotification} color={color} />
      ) : (
        <Icon name={iconName} width={iconWidth} height={formatSize(28)} color={color} />
      )}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};
