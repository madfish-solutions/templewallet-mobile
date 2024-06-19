import React, { ReactNode, memo, useCallback, useState } from 'react';
import { AlertButton, AlertOptions, View } from 'react-native';
import Dialog from 'react-native-dialog';

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
  const [alertVisible, setAlertVisible] = useState(false);

  const hideAlert = useCallback(() => setAlertVisible(false), []);

  const handleInfoIconClick = useCallback(() => void (infoAlertArgs && setAlertVisible(true)), [infoAlertArgs]);

  return (
    <View style={CheckboxGroupItemStyles.root}>
      {children}

      {infoAlertArgs && (
        <>
          <TouchableIcon name={IconNameEnum.InfoFilledAlt} onPress={handleInfoIconClick} />
          <Dialog.Container
            visible={alertVisible}
            verticalButtons
            onBackdropPress={hideAlert}
            onRequestClose={hideAlert}
          >
            <Dialog.Title>{infoAlertArgs.title}</Dialog.Title>
            <Dialog.Description>{infoAlertArgs.message}</Dialog.Description>
            {infoAlertArgs.buttons?.map((button, index) => (
              <Dialog.Button
                key={index}
                label={button.text ?? ''}
                bold={button.isPreferred}
                onPress={button.onPress ?? hideAlert}
              />
            ))}
          </Dialog.Container>
        </>
      )}
    </View>
  );
});
