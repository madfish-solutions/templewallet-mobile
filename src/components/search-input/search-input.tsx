import React, { FC } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useSearchInputStyles } from './search-input.styles';

type Props = Pick<TextInputProps, 'value' | 'placeholder' | 'onChangeText'>;

export const SearchInput: FC<Props> = ({ value, placeholder, onChangeText }) => {
  const colors = useColors();
  const styles = useSearchInputStyles();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={IconNameEnum.IosSearch} size={formatSize(14)} />
      </View>
      <TextInput
        value={value}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.gray2}
        onChangeText={onChangeText}
      />
    </View>
  );
};
