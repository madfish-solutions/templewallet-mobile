import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useFarmStoreSelector } from 'src/store/farms/selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { DEFAULT_AMOUNT, DEFAULT_DECIMALS } from '../constants';
import { useMainInfoStyles } from './main-info.styles';

export const MainInfo: FC = () => {
  const dispatch = useDispatch();

  const styles = useMainInfoStyles();
  const farms = useFarmStoreSelector();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);

  const { netApy, totalStakedAmountInUsd, totalClaimableRewardsInUsd } = useMemo(() => {
    const result = {
      netApy: new BigNumber(DEFAULT_AMOUNT),
      totalStakedAmountInUsd: new BigNumber(DEFAULT_AMOUNT),
      totalClaimableRewardsInUsd: new BigNumber(DEFAULT_AMOUNT)
    };

    let totalWeightedApr = new BigNumber(DEFAULT_AMOUNT);

    Object.entries(farms.lastStakes).forEach(([address, stakeRecord]) => {
      const farm = farms.allFarms.data.find(_farm => _farm.item.contractAddress === address);

      if (isDefined(farm)) {
        const depositValueInUsd = mutezToTz(
          new BigNumber(stakeRecord.depositAmountAtomic ?? DEFAULT_AMOUNT),
          farm.item.stakedToken.metadata.decimals
        ).multipliedBy(farm.item.depositExchangeRate ?? DEFAULT_AMOUNT);

        totalWeightedApr = totalWeightedApr.plus(
          new BigNumber(farm.item.apr ?? DEFAULT_AMOUNT).multipliedBy(depositValueInUsd)
        );
        result.totalStakedAmountInUsd = result.totalStakedAmountInUsd.plus(depositValueInUsd);
        result.totalClaimableRewardsInUsd = result.totalClaimableRewardsInUsd.plus(
          mutezToTz(
            new BigNumber(stakeRecord.claimableRewards ?? DEFAULT_AMOUNT),
            farm.item.rewardToken.metadata.decimals
          ).multipliedBy(farm.item.earnExchangeRate ?? DEFAULT_AMOUNT)
        );
      }
    });

    if (result.totalStakedAmountInUsd.isGreaterThan(DEFAULT_AMOUNT)) {
      result.netApy = totalWeightedApr.dividedBy(result.totalStakedAmountInUsd);
    }

    return result;
  }, [farms]);

  const areAnyRewards = totalClaimableRewardsInUsd.isGreaterThan(DEFAULT_AMOUNT);

  const claimAllRewards = async () => {
    const claimAllRewardParams = await Promise.all(
      Object.keys(farms.lastStakes).map(address =>
        tezos.wallet
          .at(address)
          .then(contractInstance =>
            contractInstance.methods.claim(farms.lastStakes[address].lastStakeId).toTransferParams()
          )
      )
    );

    const opParams: Array<ParamsWithKind> = claimAllRewardParams.map(transferParams => ({
      ...transferParams,
      kind: OpKind.TRANSACTION
    }));

    dispatch(
      navigateAction(ModalsEnum.Confirmation, {
        type: ConfirmationTypeEnum.InternalOperations,
        opParams,
        testID: 'CLAIM_ALL_REWARDS'
      })
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={[styles.card, styles.deposit]}>
          <Text style={styles.titleText}>CURRENT DEPOSIT AMOUNT</Text>
          <Text style={styles.valueText}>≈ {totalStakedAmountInUsd.toFixed(DEFAULT_DECIMALS)}$</Text>
        </View>
        <Divider size={formatSize(8)} />
        <View style={[styles.card, styles.netApy]}>
          <Text style={styles.titleText}>NET APY</Text>
          <Text style={styles.valueText}>{netApy.toFixed(DEFAULT_DECIMALS)}%</Text>
        </View>
      </View>
      <ButtonLargePrimary
        title={
          areAnyRewards
            ? `CLAIM ALL ≈ ${totalClaimableRewardsInUsd.toFixed(DEFAULT_DECIMALS)}$`
            : 'EARN TO CLAIM REWARDS'
        }
        disabled={!areAnyRewards}
        onPress={claimAllRewards}
      />
    </View>
  );
};
