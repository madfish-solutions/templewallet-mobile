import { debounce } from 'lodash-es';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { StyleProp, TextInputProps, View, ViewStyle } from 'react-native';

import { emptyFn } from 'src/config/general';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isString } from 'src/utils/is-string';
import { setTestID } from 'src/utils/test-id.utils';

import { IconV2 } from '../icon-v2';
import { IconNameV2Enum } from '../icon-v2/icon-name.enum';
import { PatchedTextInput } from '../patched-text-input';
import { TouchableIconV2 } from '../touchable-icon-v2';

import { useSearchInputStyles } from './search-input.styles';

interface Props
  extends Pick<TextInputProps, 'value' | 'placeholder' | 'onChangeText' | 'onBlur' | 'testID'>,
    TestIdProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export const SearchInput: FC<Props> = ({
  value,
  placeholder,
  onChangeText = emptyFn,
  onBlur = emptyFn,
  testID,
  containerStyle
}) => {
  const colors = useColors();
  const styles = useSearchInputStyles();
  const [localValue, setLocalValue] = useState(value);

  const { trackEvent } = useAnalytics();

  const debouncedOnChange = useMemo(
    () =>
      debounce((newValue: string) => {
        trackEvent(testID, AnalyticsEventCategory.FormChange, { value: newValue });
        onChangeText(newValue);
      }),
    [testID, trackEvent, onChangeText]
  );
  const handleSearchQueryChange = useCallback(
    (newValue: string) => {
      setLocalValue(newValue);
      debouncedOnChange(newValue);
    },
    [debouncedOnChange]
  );

  const clearSearchValue = useCallback(() => handleSearchQueryChange(''), [handleSearchQueryChange]);

  return (
    <View style={[styles.container, containerStyle]}>
      <PatchedTextInput
        value={localValue}
        style={[styles.input, conditionalStyle(isString(localValue), styles.clearableInput)]}
        placeholder={placeholder}
        placeholderTextColor={colors.gray2}
        onChangeText={handleSearchQueryChange}
        onBlur={onBlur}
        {...setTestID(testID)}
      />
      <View style={styles.searchIconContainer}>
        <IconV2 name={IconNameV2Enum.Search} size={16} color={colors.gray2} />
      </View>
      {isString(localValue) && (
        <View style={styles.clearIconContainer}>
          <TouchableIconV2
            name={IconNameV2Enum.XRound}
            size={formatSize(16)}
            iconSize={16}
            color={colors.gray2}
            onPress={clearSearchValue}
          />
        </View>
      )}
    </View>
  );
};
