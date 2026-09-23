import React, { FC } from 'react';
import { View } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { NetworkIcon } from 'src/components/network-icon';
import { StyledTextInput } from 'src/components/styled-text-input/styled-text-input';
import { TouchableIconV2 } from 'src/components/touchable-icon-v2';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { useColors } from 'src/styles/use-colors';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';

import { useCopyableDerivationPathStyles } from './copyable-derivation-path.styles';

interface Props extends TestIdProps {
  value: string;
  network: CryptoLogoNameEnum;
}

export const CopyableDerivationPath: FC<Props> = ({ value, network, testID }) => {
  const colors = useColors();
  const styles = useCopyableDerivationPathStyles();

  return (
    <View style={styles.row}>
      <View style={styles.inputContainer}>
        <StyledTextInput value={value} editable={false} style={styles.input} testID={testID} />
        <View style={styles.copyButtonContainer}>
          <TouchableIconV2
            name={IconNameV2Enum.Copy}
            iconSize={24}
            color={colors.blue}
            onPress={() => copyStringToClipboard(value)}
          />
        </View>
      </View>
      <NetworkIcon name={network} variant="medium" />
    </View>
  );
};
