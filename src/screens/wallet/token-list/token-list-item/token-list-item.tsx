import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { EmptyFn } from '../../../../config/general';
import { formatSize } from '../../../../styles/format-size';
import { isDefined } from '../../../../utils/is-defined';
import { useTokenListItemStyles } from './token-list-item.styles';

interface Props {
  symbol: string;
  name: string;
  balance: string;
  apy?: number;
  iconName?: IconNameEnum;
  onPress: EmptyFn;
}

export const TokenListItem: FC<Props> = ({
  symbol,
  name,
  balance,
  apy,
  iconName = IconNameEnum.NoNameToken,
  onPress
}) => {
  const styles = useTokenListItemStyles();

  return (
    <TouchableOpacity style={styles.rootContainer} onPress={onPress}>
      <View style={styles.leftContainer}>
        <Icon name={iconName} size={formatSize(40)} />
        <View style={styles.infoContainer}>
          <View style={styles.symbolContainer}>
            <Text style={styles.symbolText}>{symbol}</Text>
            {isDefined(apy) && (
              <View style={styles.apyContainer}>
                <Text style={styles.apyText}>APY: {apy}%</Text>
              </View>
            )}
          </View>
          <Text style={styles.nameText}>{name}</Text>
        </View>
      </View>

      <View style={styles.rightContainer}>
        <Text style={styles.balanceText}>{balance}</Text>
        <Text style={styles.valueText}>X XXX.XX $</Text>
      </View>
    </TouchableOpacity>
  );
};
