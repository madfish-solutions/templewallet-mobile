import { useField } from 'formik';
import React, { FC, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { hasError } from '../../utils/has-error';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { StyledTextInput } from '../styled-text-input/styled-text-input';
import { StyledTextInputProps } from '../styled-text-input/styled-text-input.props';
import { useSecureInputStyles } from './secure-input.styles';

const KEYS = ['1234567890', 'QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

interface Props extends Pick<StyledTextInputProps, 'testID'> {
  name: string;
}

export const SecureInput: FC<Props> = ({ name, testID }) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [caps, setCaps] = useState(false);
  const [field, meta, helpers] = useField<string>(name);
  const { setValue } = helpers;
  const isError = hasError(meta);
  const styles = useSecureInputStyles();

  return (
    <View style={styles.container}>
      <StyledTextInput
        value={field.value}
        isError={isError}
        isShowCleanButton={true}
        autoCapitalize="none"
        onBlur={() => helpers.setTouched(true)}
        onChangeText={field.onChange(name)}
        testID={testID}
        showSoftInputOnFocus={false}
        onFocus={() => setShowKeyboard(true)}
      />
      {showKeyboard && (
        <View>
          {KEYS.map((x, xi) => (
            <View style={styles.row}>
              {xi === 3 && (
                <View style={styles.letterContainer}>
                  <TouchableOpacity onPress={() => setCaps(!caps)}>
                    {caps ? (
                      <Icon size={formatSize(16)} name={IconNameEnum.KeyboardShift} />
                    ) : (
                      <Icon size={formatSize(16)} name={IconNameEnum.KeyboardShiftOutlined} />
                    )}
                  </TouchableOpacity>
                </View>
              )}
              {x.split('').map(key => {
                return (
                  <View style={styles.letterContainer} key={key}>
                    <TouchableOpacity
                      onPress={() => {
                        setValue(field.value + (!caps ? key.toLowerCase() : key));
                        if (!caps) {
                          setCaps(false);
                        }
                      }}
                    >
                      <Text style={styles.letter}>{key}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
              {xi === 3 && (
                <View style={styles.letterContainer}>
                  <TouchableOpacity onPress={() => setValue(field.value.slice(0, -1))}>
                    <Text style={styles.letter}>{'<-'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
          <View style={styles.letterContainerCenter}>
            <TouchableOpacity onPress={() => setShowKeyboard(false)}>
              <Text style={styles.letter}>{'Close'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
