import React, { FC, useState } from 'react';
import { View } from 'react-native';

import { emptyFn } from '../../../config/general';
import { useActiveTimer } from '../../../hooks/use-active-timer.hook';
import { formatSize } from '../../../styles/format-size';
import { copyStringToClipboard } from '../../../utils/clipboard.utils';
import { isString } from '../../../utils/is-string';
import { generateSeed } from '../../../utils/keys.util';
import { ButtonSmallSecondary } from '../../button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../divider/divider';
import { StyledTextInput } from '../../styled-text-input/styled-text-input';
import { OVERLAY_SHOW_TIMEOUT } from '../mnemonic.config';
import { MnemonicProps } from '../mnemonic.props';
import { useMnemonicStyles } from '../mnemonic.styles';
import { ProtectedOverlay } from '../protected-overlay/protected-overlay';

export const MnemonicCreate: FC<MnemonicProps> = ({ value, isError, onChangeText = emptyFn, onBlur }) => {
  const styles = useMnemonicStyles();
  const { activeTimer, clearActiveTimer } = useActiveTimer();

  const [isShowOverlay, setIsShowOverlay] = useState(isString(value));

  const hideOverlay = () => {
    clearActiveTimer();

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
        {value ? (
          <>
            <Divider size={formatSize(8)} />
            <ButtonSmallSecondary title="COPY" onPress={() => copyStringToClipboard(value)} />
          </>
        ) : null}
      </View>
      {isShowOverlay && <ProtectedOverlay onPress={hideOverlay} />}
    </View>
  );
};
