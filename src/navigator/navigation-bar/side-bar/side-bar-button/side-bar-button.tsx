import React, { FC, useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { Divider } from '../../../../components/divider/divider';
import { Icon } from '../../../../components/icon/icon';
import { IconComponent as IconComponentProps } from '../../../../components/icon/icon-component.interface';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { EmptyFn, emptyFn } from '../../../../config/general';
import { useIsSeedPhraseVerified } from '../../../../store/security/security-selectors';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { conditionalStyle } from '../../../../utils/conditional-style';
import { isDefined } from '../../../../utils/is-defined';
import { ScreensEnum } from '../../../enums/screens.enum';
import { useNavigation } from '../../../hooks/use-navigation.hook';
import { useSideBarButtonStyles } from './side-bar-button.styles';

interface Props {
  label: string;
  iconName: IconNameEnum;
  routeName: ScreensEnum.Wallet | ScreensEnum.DApps | ScreensEnum.SwapScreen | ScreensEnum.Settings;
  focused: boolean;
  disabled?: boolean;
  IconComponent?: FC<IconComponentProps>;
  disabledOnPress?: EmptyFn;
}

export const SideBarButton: FC<Props> = ({
  label,
  iconName,
  routeName,
  focused,
  disabled = false,
  IconComponent,
  disabledOnPress = emptyFn
}) => {
  const colors = useColors();
  const styles = useSideBarButtonStyles();
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
      navigate(routeName);
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
      style={[
        styles.container,
        conditionalStyle(focused, { borderLeftColor: color }),
        conditionalStyle(disabled, { borderLeftColor: color })
      ]}
      onPress={handlePress}
    >
      {isDefined(IconComponent) ? (
        <IconComponent isNotification={isNotification} color={color} />
      ) : (
        <Icon name={iconName} size={formatSize(28)} color={color} />
      )}
      <Divider size={formatSize(8)} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};
