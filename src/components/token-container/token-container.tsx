import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useTokenContainerStyles } from './token-container.styles';

export interface TokenPreviewProps {
  symbol: string;
  name: string;
  iconName?: IconNameEnum;
  apy?: number;
}

export const TokenContainer: FC<TokenPreviewProps> = ({
  symbol,
  name,
  iconName = IconNameEnum.NoNameToken,
  apy,
  children
}) => {
  const styles = useTokenContainerStyles();

  return (
    <View style={styles.container}>
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

      <View style={styles.rightContainer}>{children}</View>
    </View>
  );
}
