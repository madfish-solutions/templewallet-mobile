import { debounce } from 'lodash-es';
import React, { FC } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { TestIdProps } from '../../interfaces/test-id.props';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { setTestID } from '../../utils/test-id.utils';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useSearchInputStyles } from './search-input.styles';

type Props = Pick<TextInputProps, 'value' | 'placeholder' | 'onChangeText' | 'onBlur' | 'testID'> & TestIdProps;

export const SearchInput: FC<Props> = ({ value, placeholder, onChangeText = emptyFn, onBlur = emptyFn, testID }) => {
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
        onBlur={onBlur}
        {...setTestID(testID)}
      />
    </View>
  );
};
