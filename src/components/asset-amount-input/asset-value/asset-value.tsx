import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { isDefined } from '../../../utils/is-defined';
import { Divider } from '../../divider/divider';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { TokenIcon } from '../../token-icon/token-icon';
import { useAssetValueStyles } from './asset-value.styles';

interface AssetValueProps {
  value?: TokenInterface;
}

export const AssetValue: FC<AssetValueProps> = ({ value }) => {
  const colors = useColors();
  const styles = useAssetValueStyles();

  return (
    <View style={styles.container}>
      {isDefined(value) ? (
        <View style={styles.filler}>
          <TokenIcon token={value} />
          <Divider size={formatSize(4)} />
          <View style={styles.texts}>
            <Text style={styles.assetSymbol} ellipsizeMode="tail" numberOfLines={1}>
              {value.symbol}
            </Text>
            <Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
              {value.name}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.filler} />
      )}
      <View style={styles.dropdownTriangleWrapper}>
        <Icon name={IconNameEnum.TriangleDown} size={formatSize(24)} color={colors.orange} />
      </View>
    </View>
  );
};
