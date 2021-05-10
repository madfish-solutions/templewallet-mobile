import { useField } from 'formik';
import React, { FC, useState } from 'react';
import { View } from 'react-native';

import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../components/icon/touchable-icon/touchable-icon';
import { StyledTextInput } from '../../../components/styled-text-input/styled-text-input';
import { formatSize } from '../../../styles/format-size';
import { ErrorMessage } from '../../error-message/error-message';
import { useFormPasswordInputStyles } from './form-password-input.styles';

interface Props {
  name: string;
}

export const FormPasswordInput: FC<Props> = ({ name }) => {
  const [field, meta] = useField<string>(name);
  const hasError = meta.touched && meta.error !== undefined;
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);

  const styles = useFormPasswordInputStyles();

  return (
    <View style={styles.view}>
      <StyledTextInput
        secureTextEntry={isSecureTextEntry}
        value={field.value}
        isError={hasError}
        isShowCleanButton
        onBlur={field.onBlur(name)}
        onChangeText={field.onChange(name)}
      />
      {!!field.value && (
        <>
          {isSecureTextEntry ? (
            <TouchableIcon
              iconSize={formatSize(24)}
              style={styles.eyeButton}
              name={IconNameEnum.EyeOpenBold}
              onPress={() => setIsSecureTextEntry(false)}
            />
          ) : (
            <TouchableIcon
              iconSize={formatSize(24)}
              style={styles.eyeButton}
              name={IconNameEnum.EyeClosedBold}
              onPress={() => setIsSecureTextEntry(true)}
            />
          )}
        </>
      )}
      <ErrorMessage meta={meta} />
    </View>
  );
};
