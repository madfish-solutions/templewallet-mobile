import { debounce } from 'lodash-es';
import React, { useMemo, useState } from 'react';
import { View, TextInput } from 'react-native';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { Divider } from '../divider/divider';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';

import { useSearchStyles } from './search.styles';

interface Props extends TestIdProps {
  placeholder?: string;
  dividerSize?: number;
  onChange: SyncFn<string | undefined>;
}

export const Search: FCWithChildren<Props> = ({
  dividerSize = 24,
  placeholder = 'Search token',
  testID,
  testIDProperties,
  onChange,
  children
}) => {
  const colors = useColors();
  const { trackEvent } = useAnalytics();

  const styles = useSearchStyles();

  const debouncedOnChange = useMemo(
    () =>
      debounce((newValue: string) => {
        trackEvent(testID, AnalyticsEventCategory.FormChange, { value: newValue });
        onChange(newValue);
      }),
    [onChange, testID, trackEvent]
  );

  const [isSearchMode, setIsSearchMode] = useState(false);

  const handleSCirclePress = () => {
    trackEvent(testID, AnalyticsEventCategory.FormChange, { value: null });
    setIsSearchMode(false);
    onChange(undefined);
    if (Boolean(testID)) {
      trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);
    }
  };

  return (
    <View style={styles.container}>
      {isSearchMode ? (
        <>
          <TextInput
            autoFocus={true}
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor={colors.gray1}
            onChangeText={debouncedOnChange}
          />

          <Divider size={formatSize(8)} />
          <TouchableIcon name={IconNameEnum.XCircle} size={formatSize(16)} onPress={handleSCirclePress} />
          <Divider size={formatSize(4)} />
        </>
      ) : (
        <>
          {children}
          <Divider size={formatSize(dividerSize)} />
          <TouchableIcon name={IconNameEnum.SearchNew} onPress={() => setIsSearchMode(true)} />
        </>
      )}
    </View>
  );
};
