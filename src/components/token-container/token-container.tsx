import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { getTruncatedProps } from '../../utils/style.util';
import { Divider } from '../divider/divider';
import { TokenIcon } from '../token-icon/token-icon';
import { TokenContainerProps } from './token-container.props';
import { useTokenContainerStyles } from './token-container.styles';

export const TokenContainer: FC<TokenContainerProps> = ({ token, apy, children }) => {
  const styles = useTokenContainerStyles();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <TokenIcon iconName={token.iconName} thumbnailUri={token.thumbnailUri} />
        <Divider size={formatSize(8)} />
        <View style={styles.infoContainer}>
          <View style={styles.symbolContainer}>
            <Text {...getTruncatedProps(styles.symbolText)}>{token.symbol}</Text>
            {isDefined(apy) && (
              <View style={styles.apyContainer}>
                <Text style={styles.apyText}>APY: {Math.round(apy)}%</Text>
              </View>
            )}
          </View>
          <Text {...getTruncatedProps(styles.nameText)}>{token.name}</Text>
        </View>
        <Divider size={formatSize(8)} />
      </View>

      <View style={styles.rightContainer}>{children}</View>
    </View>
  );
};
