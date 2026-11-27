import React, { FC } from 'react';
import { View } from 'react-native';

import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { TouchableIconV2 } from 'src/components/touchable-icon-v2';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { SwapAssetsButtonStyles } from '../swap-form/swap-assets-button/swap-assets-button.styles';

interface Props extends TestIdProps {
  onPress: EmptyFn;
  disabled?: boolean;
}

export const SwapDirectionButton: FC<Props> = ({ onPress, disabled, testID }) => {
  const colors = useColors();

  return (
    <View style={SwapAssetsButtonStyles.container}>
      <TouchableIconV2
        onPress={onPress}
        disabled={disabled}
        name={IconNameV2Enum.ArrowUpDown}
        size={formatSize(24)}
        iconSize={24}
        color={colors.orange}
        testID={testID}
      />
    </View>
  );
};
