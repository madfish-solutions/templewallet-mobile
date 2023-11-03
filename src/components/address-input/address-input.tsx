import Clipboard from '@react-native-clipboard/clipboard';
import React, { FC, useRef } from 'react';
import { TextInput, View } from 'react-native';

import { emptyFn } from 'src/config/general';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isString } from 'src/utils/is-string';

import { ButtonSmallSecondary } from '../button/button-small/button-small-secondary/button-small-secondary';
import { StyledTextInput } from '../styled-text-input/styled-text-input';
import { StyledTextInputProps } from '../styled-text-input/styled-text-input.props';
import { StyledTextInputStyles } from '../styled-text-input/styled-text-input.styles';

import { AddressInputStyles } from './address-input.styles';

interface Props
  extends Pick<StyledTextInputProps, 'value' | 'placeholder' | 'isError' | 'onBlur' | 'onChangeText'>,
    TestIdProps {
  pasteButtonTestID?: string;
  pasteButtonTestIDProperties?: object;
}

export const AddressInput: FC<Props> = ({
  value,
  placeholder,
  isError,
  onBlur,
  onChangeText = emptyFn,
  testID,
  testIDProperties,
  pasteButtonTestID,
  pasteButtonTestIDProperties
}) => {
  const inputRef = useRef<TextInput>(null);
  const { trackEvent } = useAnalytics();

  const handlePasteButtonPress = async () => {
    inputRef.current?.focus();
    trackEvent(pasteButtonTestID, AnalyticsEventCategory.ButtonPress, pasteButtonTestIDProperties);
    onChangeText(await Clipboard.getString());
  };

  return (
    <View style={AddressInputStyles.container}>
      <StyledTextInput
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        multiline={true}
        autoCapitalize="none"
        style={StyledTextInputStyles.addressInput}
        isError={isError}
        isShowCleanButton={true}
        onBlur={onBlur}
        onChangeText={onChangeText}
        testID={testID}
        testIDProperties={testIDProperties}
      />
      {!isString(value) && (
        <View style={AddressInputStyles.buttonsContainer}>
          <ButtonSmallSecondary title="Paste" onPress={handlePasteButtonPress} />
        </View>
      )}
    </View>
  );
};
