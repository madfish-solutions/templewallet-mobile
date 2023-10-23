import { debounce } from 'lodash-es';
import React, { FC, useMemo } from 'react';
import { StyleProp, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { emptyFn } from 'src/config/general';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { setTestID } from 'src/utils/test-id.utils';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useSearchInputStyles } from './search-input.styles';

type Props = Pick<TextInputProps, 'value' | 'placeholder' | 'onChangeText' | 'onBlur' | 'testID'> &
  TestIdProps & { style?: StyleProp<ViewStyle> };

export const SearchInput: FC<Props> = ({
  value,
  placeholder,
  onChangeText = emptyFn,
  onBlur = emptyFn,
  style,
  testID
}) => {
  const colors = useColors();
  const styles = useSearchInputStyles();

  const { trackEvent } = useAnalytics();

  const handleSearchQueryChange = useMemo(
    () =>
      debounce((newValue: string) => {
        trackEvent(testID, AnalyticsEventCategory.FormChange, { value: newValue });
        onChangeText(newValue);
      }),
    [testID, trackEvent, onChangeText]
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Icon name={IconNameEnum.IosSearch} size={formatSize(14)} color={colors.gray2} />
      </View>
      <TextInput
        value={value}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.gray2}
        onChangeText={handleSearchQueryChange}
        onBlur={onBlur}
        {...setTestID(testID)}
      />
    </View>
  );
};
