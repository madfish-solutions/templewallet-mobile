import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from 'src/styles/format-size';
import { getTruncatedProps } from 'src/utils/style.util';

import { INITIAL_ARP_VALUE } from '../../apis/youves/constants';
import { DelegateTag } from '../delegate-tag/delegate-tag';
import { Divider } from '../divider/divider';
import { TokenIcon } from '../token-icon/token-icon';
import { TokenContainerProps } from './token-container.props';
import { useTokenContainerStyles } from './token-container.styles';

export const TokenContainer: FC<TokenContainerProps> = ({ token, apy = INITIAL_ARP_VALUE, children }) => {
  const styles = useTokenContainerStyles();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <TokenIcon iconName={token.iconName} thumbnailUri={token.thumbnailUri} />
        <Divider size={formatSize(8)} />
        <View style={styles.infoContainer}>
          <View style={styles.symbolContainer}>
            <Text {...getTruncatedProps(styles.symbolText)}>{token.symbol}</Text>
            <DelegateTag token={token} apy={apy} />
          </View>
          <Text {...getTruncatedProps(styles.nameText)}>{token.name}</Text>
        </View>
        <Divider size={formatSize(8)} />
      </View>

      <View style={styles.rightContainer}>{children}</View>
    </View>
  );
};
