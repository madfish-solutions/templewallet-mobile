import React, { FC, useState } from 'react';
import { View } from 'react-native';

import { isString } from '../../utils/is-string';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { StyledTextInput, StyledTextInputProps } from '../styled-text-input/styled-text-input';
import { useStyledPasswordInputStyles } from './styled-password-input.styles';

type Props = Omit<StyledTextInputProps, 'isPasswordInput'>;

export const StyledPasswordInput: FC<Props> = ({ value, ...props }) => {
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);

  const styles = useStyledPasswordInputStyles();

  return (
    <View style={styles.view}>
      <StyledTextInput secureTextEntry={isSecureTextEntry} value={value} isPasswordInput {...props} />
      {isString(value) && (
        <View style={styles.eyeButton}>
          <TouchableIcon
            name={isSecureTextEntry ? IconNameEnum.EyeOpenBold : IconNameEnum.EyeClosedBold}
            onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}
          />
        </View>
      )}
    </View>
  );
};
