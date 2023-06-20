import { OpKind } from '@taquito/rpc';
import { ParamsWithKind, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { isEmptyArray } from 'formik';
import React, { FC, useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { Button } from 'src/components/button/button';
import { Divider } from 'src/components/divider/divider';
import { FormattedAmount } from 'src/components/formatted-amount';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { useUserFarmingStats } from 'src/hooks/use-user-farming-stats';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useFarmStoreSelector } from 'src/store/farms/selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { useButtonPrimaryStyleConfig } from '../button-primary.styles';
import { DEFAULT_AMOUNT, DEFAULT_DECIMALS, PENNY } from '../constants';
import { useMainInfoStyles } from './main-info.styles';

export const MainInfo: FC = () => {
  const dispatch = useDispatch();

  const styles = useMainInfoStyles();
  const buttonPrimaryStylesConfig = useButtonPrimaryStyleConfig();
  const farms = useFarmStoreSelector();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);

  const farmsWithEndedRewards = useMemo(() => {
    const now = Date.now();

    return Object.entries(farms.lastStakes).filter(
      ([, stakeRecord]) =>
        new BigNumber(stakeRecord?.claimableRewards ?? 0).isGreaterThan(DEFAULT_AMOUNT) &&
        (stakeRecord?.rewardsDueDate ?? DEFAULT_AMOUNT) < now
    );
  }, [farms]);

  const { netApy, totalStakedAmountInUsd } = useUserFarmingStats();

  const totalClaimableRewardsInUsd = useMemo(() => {
    let result = new BigNumber(PENNY);

    farmsWithEndedRewards.forEach(([address, stakeRecord]) => {
      const farm = farms.allFarms.data.find(_farm => _farm.item.contractAddress === address);

      if (isDefined(farm)) {
        result = result.plus(
          mutezToTz(
            new BigNumber(stakeRecord.claimableRewards ?? DEFAULT_AMOUNT),
            farm.item.rewardToken.metadata.decimals
          ).multipliedBy(farm.item.earnExchangeRate ?? DEFAULT_AMOUNT)
        );
      }
    });

    return result;
  }, [farms, farmsWithEndedRewards]);

  const areSomeRewardsClaimable = useMemo(
    () => !isEmptyArray(farmsWithEndedRewards) && totalClaimableRewardsInUsd.isGreaterThan(PENNY),
    [farmsWithEndedRewards, totalClaimableRewardsInUsd]
  );

  const navigateHarvestFarm = useCallback(
    (opParams: Array<ParamsWithKind>) =>
      dispatch(
        navigateAction(ModalsEnum.Confirmation, {
          type: ConfirmationTypeEnum.InternalOperations,
          opParams,
          testID: 'CLAIM_REWARDS'
        })
      ),
    []
  );

  const claimAllRewards = async () => {
    const claimAllRewardParams: Array<TransferParams> = await Promise.all(
      farmsWithEndedRewards.map(([address, stakeRecord]) =>
        tezos.wallet
          .at(address)
          .then(contractInstance => contractInstance.methods.claim(stakeRecord.lastStakeId).toTransferParams())
      )
    );

    const opParams: Array<ParamsWithKind> = claimAllRewardParams.map(transferParams => ({
      ...transferParams,
      kind: OpKind.TRANSACTION
    }));

    if (areSomeRewardsClaimable) {
      navigateHarvestFarm(opParams);
    }
  };

  return (
    <View style={styles.root}>
      <View>
        <View style={styles.container}>
          <View style={[styles.card, styles.deposit]}>
            <Text style={styles.titleText}>CURRENT DEPOSIT AMOUNT</Text>
            <FormattedAmount isDollarValue amount={totalStakedAmountInUsd} style={styles.valueText} />
          </View>
          <Divider size={formatSize(8)} />
          <View style={[styles.card, styles.netApy]}>
            <Text style={styles.titleText}>NET APY</Text>
            <Text style={styles.valueText}>{netApy.toFixed(DEFAULT_DECIMALS)}%</Text>
          </View>
        </View>
        <Button
          styleConfig={buttonPrimaryStylesConfig}
          title={
            areSomeRewardsClaimable
              ? `CLAIM ALL ≈ ${totalClaimableRewardsInUsd.toFixed(DEFAULT_DECIMALS)}$`
              : 'EARN TO CLAIM REWARDS'
          }
          disabled={!areSomeRewardsClaimable}
          onPress={claimAllRewards}
        />
      </View>
    </View>
  );
};
