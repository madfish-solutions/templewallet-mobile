import Clipboard from '@react-native-clipboard/clipboard';
import { useField } from 'formik';
import React, { FC, useRef } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { ButtonSmallSecondary } from '../../components/button/button-small/button-small-secondary/button-small-secondary';
import { StyledTextInput } from '../../components/styled-text-input/styled-text-input';
import { StyledTextInputProps } from '../../components/styled-text-input/styled-text-input.props';
import { ErrorMessage } from '../../form/error-message/error-message';
import { TestIdProps } from '../../interfaces/test-id.props';
import { GenerateArtSelectors } from '../../screens/text-to-nft/generate-art/selectors';
import { AnalyticsEventCategory } from '../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../utils/analytics/use-analytics.hook';
import { hasError } from '../../utils/has-error';
import { isString } from '../../utils/is-string';
import { styles } from './form-text-area.styles';

interface Props extends Pick<StyledTextInputProps, 'placeholder'>, TestIdProps {
  name: string;
}

export const FormTextArea: FC<Props> = ({ name, placeholder, testID }) => {
  const inputRef = useRef<TextInput>(null);
  const { trackEvent } = useAnalytics();

  const [field, meta, helpers] = useField<string>(name);
  const isError = hasError(meta);

  const touchField = () => {
    helpers.setTouched(true);
  };

  const handlePaste = async () => {
    inputRef.current?.focus();
    touchField();

    const clipboardValue = await Clipboard.getString();
    helpers.setValue(clipboardValue);

    trackEvent(GenerateArtSelectors.pasteButton, AnalyticsEventCategory.ButtonPress);
  };

  const handleChangeText = (value: string) => {
    field.onChange(name)(value);

    if (isString(value)) {
      helpers.setTouched(true, false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <StyledTextInput
          ref={inputRef}
          value={field.value}
          placeholder={placeholder}
          multiline={true}
          autoCapitalize="none"
          isError={isError}
          isShowCleanButton={true}
          onBlur={touchField}
          onChangeText={handleChangeText}
          style={styles.textArea}
          testID={testID}
        />

        {!isString(field.value) && (
          <View style={styles.buttonsContainer}>
            <ButtonSmallSecondary title="Paste" onPress={handlePaste} />
          </View>
        )}
      </View>

      {isError && <ErrorMessage meta={meta} />}
    </>
  );
};
