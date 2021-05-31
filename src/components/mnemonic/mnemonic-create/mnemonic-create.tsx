import { useClipboard } from '@react-native-clipboard/clipboard';
import React, { FC, useRef, useState } from 'react';
import { View } from 'react-native';

import { emptyFn } from '../../../config/general';
import { formatSize } from '../../../styles/format-size';
import { isDefined } from '../../../utils/is-defined';
import { isString } from '../../../utils/is-string';
import { generateSeed } from '../../../utils/keys.util';
import { ButtonSmallSecondary } from '../../button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../divider/divider';
import { StyledTextInput, StyledTextInputProps } from '../../styled-text-input/styled-text-input';
import { useMnemonicStyles } from '../mnemonic.styles';
import { ProtectedOverlay } from '../protected-overlay/protected-overlay';

const OVERLAY_SHOW_TIMEOUT = 12000;

type Props = Pick<StyledTextInputProps, 'value' | 'isError' | 'onChangeText' | 'onBlur'>;

export const MnemonicCreate: FC<Props> = ({ value, isError, onChangeText = emptyFn, onBlur }) => {
  const styles = useMnemonicStyles();
  const [, setClipboardValue] = useClipboard();

  const [isShowOverlay, setIsShowOverlay] = useState(isString(value));
  const activeTimer = useRef<ReturnType<typeof setTimeout>>();

  const hideOverlay = () => {
    isDefined(activeTimer.current) && clearTimeout(activeTimer.current);

    setIsShowOverlay(false);
    activeTimer.current = setTimeout(() => setIsShowOverlay(true), OVERLAY_SHOW_TIMEOUT);
  };

  const handleGenerateNewButtonPress = () => {
    onChangeText(generateSeed());
    hideOverlay();
  };

  return (
    <View style={styles.container}>
      <StyledTextInput
        value={value}
        isError={isError}
        editable={false}
        multiline={true}
        onBlur={onBlur}
        onChangeText={onChangeText}
      />
      <View style={styles.buttonsContainer}>
        <ButtonSmallSecondary title="GEN NEW" onPress={handleGenerateNewButtonPress} />
        <Divider size={formatSize(8)} />
        <ButtonSmallSecondary title="COPY" onPress={() => isString(value) && setClipboardValue(value)} />
      </View>
      {isShowOverlay && <ProtectedOverlay onPress={hideOverlay} />}
    </View>
  );
};
