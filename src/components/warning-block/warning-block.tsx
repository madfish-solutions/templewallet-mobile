import React from 'react';
import { Text, View } from 'react-native';

import { useColors } from '../../styles/use-colors';
import { hexa } from '../../utils/style.util';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useWarningBlockStyles } from './warning-block.styles';

export const WarningBlock = () => {
  const styles = useWarningBlockStyles();
  const colors = useColors();

  return (
    <View style={styles.warningBlockWrapper}>
      <View style={{ backgroundColor: hexa(colors.peach, 0.1) }}>
        <View style={styles.innerContent}>
          <Icon style={styles.iconLeft} name={IconNameEnum.Alert} />
          <View style={styles.textWrapper}>
            <Text style={styles.textStyle}>
              Temple Wallet doesn't apply any fees to exchanges for now but it may apply in the future.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
