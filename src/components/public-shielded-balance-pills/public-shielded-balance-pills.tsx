import { BigNumber } from 'bignumber.js';
import React, { memo, ReactNode, useMemo } from 'react';
import { Text, View } from 'react-native';

import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { TEZ_TOKEN_DECIMALS } from 'src/token/data/tokens-metadata';
import { mutezToTz } from 'src/utils/tezos.util';

import { usePublicShieldedBalancePillsStyles } from './public-shielded-balance-pills.styles';

interface Props {
  atomicBalance: string;
  shieldedAtomicBalance?: string;
  children?: ReactNode;
}

export const PublicShieldedBalancePills = memo<Props>(({ atomicBalance, shieldedAtomicBalance, children }) => {
  const styles = usePublicShieldedBalancePillsStyles();

  const shieldedBalanceMutez = shieldedAtomicBalance ?? '0';

  const formattedPublicBalance = useMemo(
    () => mutezToTz(new BigNumber(atomicBalance).minus(shieldedBalanceMutez), TEZ_TOKEN_DECIMALS).toFormat(),
    [atomicBalance, shieldedBalanceMutez]
  );
  const formattedShieldedBalance = useMemo(
    () => mutezToTz(new BigNumber(shieldedBalanceMutez), TEZ_TOKEN_DECIMALS).toFormat(),
    [shieldedBalanceMutez]
  );

  return (
    <>
      <View style={styles.balancePill}>
        <Text style={styles.balancePillText}>Public:</Text>
        <HideBalance textStyle={styles.balancePillTextNumber}>{formattedPublicBalance}</HideBalance>
      </View>

      {children}

      <View style={styles.balancePill}>
        <Text style={styles.balancePillText}>Shielded:</Text>
        <HideBalance textStyle={styles.balancePillTextNumber}>{formattedShieldedBalance}</HideBalance>
      </View>
    </>
  );
});
