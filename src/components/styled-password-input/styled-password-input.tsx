import React, { FC, useCallback, useState } from 'react';
import { View } from 'react-native';

import { useActiveTimer } from '../../hooks/use-active-timer.hook';
import { isString } from '../../utils/is-string';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { OVERLAY_SHOW_TIMEOUT } from '../mnemonic/mnemonic.config';
import { StyledTextInput } from '../styled-text-input/styled-text-input';

import { StyledPasswordInputProps } from './styled-password-input.props';
import { useStyledPasswordInputStyles } from './styled-password-input.styles';

export const StyledPasswordInput: FC<StyledPasswordInputProps> = ({ value, ...props }) => {
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);
  const { activeTimer, clearActiveTimer } = useActiveTimer();

  const styles = useStyledPasswordInputStyles();

  const handleSecureEntryPress = useCallback(() => {
    if (isSecureTextEntry) {
      clearActiveTimer();
      activeTimer.current = setTimeout(() => void setIsSecureTextEntry(true), OVERLAY_SHOW_TIMEOUT);
    }
    setIsSecureTextEntry(!isSecureTextEntry);
  }, [clearActiveTimer, activeTimer, isSecureTextEntry, setIsSecureTextEntry]);

  return (
    <View style={styles.view}>
      <StyledTextInput secureTextEntry={isSecureTextEntry} value={value} isPasswordInput {...props} />
      {isString(value) && (
        <View style={styles.eyeButton}>
          <TouchableIcon
            name={isSecureTextEntry ? IconNameEnum.EyeOpenBold : IconNameEnum.EyeClosedBold}
            onPress={handleSecureEntryPress}
          />
        </View>
      )}
    </View>
  );
};
