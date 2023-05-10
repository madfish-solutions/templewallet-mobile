import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { formatSize } from 'src/styles/format-size';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';

import { useFarmTokensStyles } from './farm-tokens.styles';

type FarmToken = Pick<TokenMetadataInterface, 'symbol' | 'thumbnailUri' | 'iconName'>;

interface Props {
  tokenA: FarmToken;
  tokenB: FarmToken;
  rewardToken: FarmToken;
}

export const FarmTokens: FC<Props> = ({ tokenA, tokenB, rewardToken }) => {
  const styles = useFarmTokensStyles();

  return (
    <View>
      <View style={styles.row}>
        <View style={[styles.row, styles.tokensContainer]}>
          <TokenIcon iconName={tokenA.iconName} thumbnailUri={tokenA.thumbnailUri} size={formatSize(32)} />
          <TokenIcon
            iconName={tokenB.iconName}
            thumbnailUri={tokenB.thumbnailUri}
            size={formatSize(32)}
            style={styles.tokenB}
          />
          <TokenIcon
            iconName={rewardToken.iconName}
            thumbnailUri={rewardToken.thumbnailUri}
            size={formatSize(20)}
            style={styles.rewardToken}
          />
        </View>
        <Divider size={formatSize(14)} />
        <View>
          <Text style={styles.stakeTokenSymbols}>
            {tokenA.symbol} / {tokenB.symbol}
          </Text>
          <Text style={styles.rewardTokenSymbol}>Earn {rewardToken.symbol}</Text>
        </View>
      </View>
    </View>
  );
};
