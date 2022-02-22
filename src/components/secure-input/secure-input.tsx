import { debounce } from 'lodash-es';
import React, { FC, useState } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { useColors } from '../../styles/use-colors';
import { useSecureInputStyles } from './secure-input.styles';

const KEYS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

export const SecureInput: FC<Pick<TextInputProps, 'value' | 'placeholder' | 'onChangeText'>> = ({
  value,
  placeholder,
  onChangeText = emptyFn
}) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const colors = useColors();
  const styles = useSecureInputStyles();

  const debouncedOnChangeText = debounce(onChangeText);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowKeyboard(true)}>
        <TextInput
          value={value}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.gray2}
          onChangeText={debouncedOnChangeText}
          editable={false}
        />
      </TouchableOpacity>
      {showKeyboard && (
        <View>
          {KEYS.map((x, xi) => (
            <View style={styles.row}>
              {xi === 2 && (
                <View style={styles.letterContainer}>
                  <TouchableOpacity onPress={() => setShowKeyboard(false)}>
                    <Text style={styles.letter}>^</Text>
                  </TouchableOpacity>
                </View>
              )}
              {x.split('').map(key => {
                const ke = '';

                return (
                  <View style={styles.letterContainer} key={key}>
                    <TouchableOpacity
                      onPress={() => {
                        // stub
                      }}
                    >
                      <Text style={styles.letter}>
                        {key} {ke}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
              {xi === 2 && (
                <View style={styles.letterContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      // stub
                    }}
                  >
                    <Text style={styles.letter}>{'<-'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
