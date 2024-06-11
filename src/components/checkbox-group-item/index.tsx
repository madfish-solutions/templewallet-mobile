import React, { ReactNode, memo, useCallback } from 'react';
import { Alert, AlertButton, AlertOptions, View } from 'react-native';

import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';

import { CheckboxGroupItemStyles } from './styles';

interface CheckboxGroupItemProps {
  infoAlertArgs?: {
    title: string;
    message: string;
    buttons?: AlertButton[];
    options?: AlertOptions;
  };
  children: ReactNode;
}

export const CheckboxGroupItem = memo<CheckboxGroupItemProps>(({ infoAlertArgs, children }) => {
  const handleInfoIconClick = useCallback(() => {
    if (!infoAlertArgs) {
      return;
    }

    const { title, message, buttons, options } = infoAlertArgs;
    Alert.alert(title, message, buttons, options);
  }, [infoAlertArgs]);

  return (
    <View style={CheckboxGroupItemStyles.root}>
      {children}

      {infoAlertArgs && <TouchableIcon name={IconNameEnum.InfoFilledAlt} onPress={handleInfoIconClick} />}
    </View>
  );
});
