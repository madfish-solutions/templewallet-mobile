import React, { FC } from 'react';
import { ImageBackground, TextInput, TextInputProps, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { useColors } from '../../styles/use-colors';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { useStyledTextInputStyles } from './styled-text-input.styles';

interface Props extends Omit<TextInputProps, 'style'> {
  isError?: boolean;
  isShowCleanButton?: boolean;
}

export const StyledTextInput: FC<Props> = ({
  onChangeText = emptyFn,
  isShowCleanButton = false,
  isError = false,
  value,
  multiline,
  ...props
}) => {
  const styles = useStyledTextInputStyles();
  const colors = useColors();

  return (
    <View style={styles.view}>
      <ImageBackground
        source={{ uri: require('/mnemonic-bg.gif') }}
        style={{
          flex: 1,
          justifyContent: 'center'
        }}>
        <TextInput
          style={[multiline ? styles.multiline : styles.regular, isError && styles.error]}
          multiline={multiline}
          placeholderTextColor={colors.gray3}
          selectionColor={colors.orange}
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
        {isShowCleanButton && !!value && (
          <TouchableIcon name={IconNameEnum.XCircle} style={styles.cleanButton} onPress={() => onChangeText('')} />
        )}
      </ImageBackground>
    </View>
  );
};
