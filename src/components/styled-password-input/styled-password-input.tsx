import React, { FC, useState } from 'react';
import { View } from 'react-native';

import { useActiveTimer } from '../../hooks/use-active-timer.hook';
import { isString } from '../../utils/is-string';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { StyledTextInput } from '../styled-text-input/styled-text-input';
import { StyledPasswordInputProps } from './styled-password-input.props';
import { useStyledPasswordInputStyles } from './styled-password-input.styles';

export const StyledPasswordInput: FC<StyledPasswordInputProps> = ({ value, ...props }) => {
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);
  const { activeTimer, clearActiveTimer } = useActiveTimer();

  const styles = useStyledPasswordInputStyles();

  const handleSecureEntryPress = () => {
    if (!isSecureTextEntry) {
      clearActiveTimer();
      activeTimer.current = setTimeout(() => setIsSecureTextEntry(true), 10_000);
    }
    setIsSecureTextEntry(!isSecureTextEntry);
  };

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
