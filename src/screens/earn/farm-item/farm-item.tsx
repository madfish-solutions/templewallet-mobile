import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { Bage } from 'src/components/bage/bage';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { formatSize } from 'src/styles/format-size';
import { LOCAL_MAINNET_TOKENS_METADATA } from 'src/token/data/tokens-metadata';

import { FarmTokens } from '../farm-tokens/farm-tokens';
import { useFarmItemStyles } from './farm-item.styles';

const TOKEN_A = {
  symbol: LOCAL_MAINNET_TOKENS_METADATA[3].symbol,
  thumbnailUri: LOCAL_MAINNET_TOKENS_METADATA[3].thumbnailUri,
  iconName: LOCAL_MAINNET_TOKENS_METADATA[3].iconName
};
const TOKEN_B = {
  symbol: LOCAL_MAINNET_TOKENS_METADATA[1].symbol,
  thumbnailUri: LOCAL_MAINNET_TOKENS_METADATA[1].thumbnailUri,
  iconName: LOCAL_MAINNET_TOKENS_METADATA[1].iconName
};
const REWARD_TOKEN = {
  symbol: LOCAL_MAINNET_TOKENS_METADATA[2].symbol,
  thumbnailUri: LOCAL_MAINNET_TOKENS_METADATA[2].thumbnailUri,
  iconName: LOCAL_MAINNET_TOKENS_METADATA[2].iconName
};

export const FarmItem: FC = () => {
  const styles = useFarmItemStyles();

  return (
    <View style={styles.root}>
      <View style={styles.bageContainer}>
        <Bage text="Stable Pool" color="#46BC94" style={{ ...styles.bage, zIndex: 3 }} />
        <Bage text="Long Term" />
      </View>
      <View style={styles.mainContent}>
        <View style={[styles.tokensContainer, styles.row]}>
          <FarmTokens tokenA={TOKEN_A} tokenB={TOKEN_B} rewardToken={REWARD_TOKEN} />
          <View>
            <Text style={styles.apyText}>APY: 7.08%</Text>
            <Text style={styles.attributeTitle}>Quipuswap</Text>
          </View>
        </View>

        <View style={[styles.row, styles.mb16]}>
          <View>
            <Text style={styles.attributeTitle}>Your deposit:</Text>
            <Text style={styles.attributeValue}>≈ 123.12$</Text>
          </View>
          <View>
            <Text style={styles.attributeTitle}>Claimable rewards:</Text>
            <Text style={styles.attributeValue}>≈ 102.03$</Text>
          </View>
        </View>

        <View style={styles.row}>
          <ButtonLargeSecondary title="MANAGE" onPress={() => console.log('ButtonLargeSecondary')} />
          <Divider size={formatSize(8)} />
          <ButtonLargePrimary title="CLAIM REWARDS" onPress={() => console.log('ButtonLargePrimary')} />
        </View>
      </View>
    </View>
  );
};
