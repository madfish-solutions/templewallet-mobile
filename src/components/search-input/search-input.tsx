import { debounce } from 'lodash-es';
import React, { FC } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useSearchInputStyles } from './search-input.styles';

export const SearchInput: FC<Pick<TextInputProps, 'value' | 'placeholder' | 'onChangeText'>> = ({
  value,
  placeholder,
  onChangeText = emptyFn
}) => {
  const colors = useColors();
  const styles = useSearchInputStyles();

  const debouncedOnChangeText = debounce(onChangeText);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={IconNameEnum.IosSearch} size={formatSize(14)} color={colors.gray2} />
      </View>
      <TextInput
        value={value}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.gray2}
        onChangeText={debouncedOnChangeText}
      />
    </View>
  );
};
