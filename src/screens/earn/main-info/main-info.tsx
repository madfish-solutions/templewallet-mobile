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
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useAllFarmsSelector, useLastStakesSelector } from 'src/store/farms/selectors';
import { navigateAction } from 'src/store/root-state.actions';
import {
  useCurrentFiatCurrencyMetadataSelector,
  useFiatToUsdRateSelector
} from 'src/store/settings/settings-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { aprToApy } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { useButtonPrimaryStyleConfig } from '../button-primary.styles';
import { DEFAULT_AMOUNT, DEFAULT_DECIMALS, DEFAULT_EXCHANGE_RATE, PENNY } from '../constants';
import { EarnSelectorsEnum } from '../earn.selectors';
import { useMainInfoStyles } from './main-info.styles';

export const MainInfo: FC = () => {
  const dispatch = useDispatch();

  const styles = useMainInfoStyles();
  const buttonPrimaryStylesConfig = useButtonPrimaryStyleConfig();
  const farms = useAllFarmsSelector();
  const stakes = useLastStakesSelector();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const fiatToUsdRate = useFiatToUsdRateSelector();
  const { symbol: fiatSymbol } = useCurrentFiatCurrencyMetadataSelector();

  const stakesEntriesWithEndedRewards = useMemo(() => {
    const now = Date.now();

    return Object.entries(stakes).filter(
      ([contractAddress, stakeRecord]) =>
        new BigNumber(stakeRecord?.claimableRewards ?? 0).isGreaterThan(DEFAULT_AMOUNT) &&
        (stakeRecord?.rewardsDueDate ?? DEFAULT_AMOUNT) < now &&
        farms.data.some(farm => farm.item.contractAddress === contractAddress)
    );
  }, [stakes, farms]);

  const { netApy, totalStakedAmountInFiat } = useMemo(() => {
    const result = {
      netApy: new BigNumber(DEFAULT_AMOUNT),
      totalStakedAmountInFiat: new BigNumber(DEFAULT_AMOUNT),
      totalClaimableRewardsInFiat: new BigNumber(DEFAULT_AMOUNT)
    };

    let totalWeightedApy = new BigNumber(DEFAULT_AMOUNT);

    Object.entries(stakes).forEach(([address, stakeRecord]) => {
      const farm = farms.data.find(_farm => _farm.item.contractAddress === address);

      if (isDefined(farm)) {
        const depositValueInUsd = mutezToTz(
          new BigNumber(stakeRecord.depositAmountAtomic ?? DEFAULT_AMOUNT),
          farm.item.stakedToken.metadata.decimals
        ).multipliedBy(farm.item.depositExchangeRate ?? DEFAULT_EXCHANGE_RATE);

        totalWeightedApy = totalWeightedApy.plus(
          new BigNumber(aprToApy(Number(farm.item.apr) ?? DEFAULT_AMOUNT)).multipliedBy(depositValueInUsd)
        );
        result.totalStakedAmountInFiat = result.totalStakedAmountInFiat.plus(depositValueInUsd);
        result.totalClaimableRewardsInFiat = result.totalClaimableRewardsInFiat.plus(
          mutezToTz(
            new BigNumber(stakeRecord.claimableRewards ?? DEFAULT_AMOUNT),
            farm.item.rewardToken.metadata.decimals
          ).multipliedBy(farm.item.earnExchangeRate ?? DEFAULT_EXCHANGE_RATE)
        );
      }
    });

    if (result.totalStakedAmountInFiat.isGreaterThan(DEFAULT_AMOUNT)) {
      result.netApy = totalWeightedApy.dividedBy(result.totalStakedAmountInFiat);
    }

    result.totalStakedAmountInFiat = result.totalStakedAmountInFiat.multipliedBy(
      fiatToUsdRate ?? DEFAULT_EXCHANGE_RATE
    );

    return result;
  }, [farms, stakes]);

  const totalClaimableRewardsInFiat = useMemo(() => {
    let result = new BigNumber(PENNY);

    stakesEntriesWithEndedRewards.forEach(([address, stakeRecord]) => {
      const farm = farms.data.find(_farm => _farm.item.contractAddress === address);

      if (isDefined(farm)) {
        result = result.plus(
          mutezToTz(
            new BigNumber(stakeRecord.claimableRewards ?? DEFAULT_EXCHANGE_RATE),
            farm.item.rewardToken.metadata.decimals
          )
            .multipliedBy(farm.item.earnExchangeRate ?? DEFAULT_EXCHANGE_RATE)
            .multipliedBy(fiatToUsdRate ?? DEFAULT_EXCHANGE_RATE)
        );
      }
    });

    return result;
  }, [farms, stakesEntriesWithEndedRewards, fiatToUsdRate]);

  const areSomeRewardsClaimable = useMemo(
    () => !isEmptyArray(stakesEntriesWithEndedRewards) && totalClaimableRewardsInFiat.isGreaterThan(PENNY),
    [stakesEntriesWithEndedRewards, totalClaimableRewardsInFiat]
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
      stakesEntriesWithEndedRewards.map(([address, stakeRecord]) =>
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
            <FormattedAmount isDollarValue amount={totalStakedAmountInFiat} style={styles.valueText} />
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
              ? `CLAIM ALL ≈ ${totalClaimableRewardsInFiat.toFixed(DEFAULT_DECIMALS)}${fiatSymbol}`
              : 'EARN TO CLAIM REWARDS'
          }
          disabled={!areSomeRewardsClaimable}
          onPress={claimAllRewards}
          testID={EarnSelectorsEnum.claimRewardsButton}
        />
      </View>
    </View>
  );
};
