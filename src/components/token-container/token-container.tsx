import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { TokenIcon } from '../token-icon/token-icon';
import { TokenContainerProps } from './token-container.props';
import { useTokenContainerStyles } from './token-container.styles';

export const TokenContainer: FC<TokenContainerProps> = ({ token, apy, children }) => {
  const styles = useTokenContainerStyles();

  const { symbol, name } = token;

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <TokenIcon token={token} />
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
};
