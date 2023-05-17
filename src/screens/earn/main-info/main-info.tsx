import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useLastStakesSelector, useMainInfoSelector } from 'src/store/farms/selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';

import { useMainInfoStyles } from './main-info.styles';

export const MainInfo: FC = () => {
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const styles = useMainInfoStyles();
  const stakes = useLastStakesSelector();
  const dispatch = useDispatch();

  const { totalStakedAmountInUsd, netApy, totalClaimableRewardsInUsd } = useMainInfoSelector();

  const areAnyRewards = new BigNumber(totalClaimableRewardsInUsd).isGreaterThan(0);
  const claimAllRewards = async () => {
    const claimAllRewardParams = await Promise.all(
      Object.keys(stakes).map(address =>
        tezos.wallet
          .at(address)
          .then(contractInstance => contractInstance.methods.claim(stakes[address].lastStakeId).toTransferParams())
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
    <View>
      <View style={styles.container}>
        <View style={[styles.card, styles.deposit]}>
          <Text style={styles.titleText}>CURRENT DEPOSIT AMOUNT</Text>
          <Text style={styles.valueText}>≈ {totalStakedAmountInUsd}$</Text>
        </View>
        <Divider size={formatSize(8)} />
        <View style={[styles.card, styles.netApy]}>
          <Text style={styles.titleText}>NET APY</Text>
          <Text style={styles.valueText}>{netApy}%</Text>
        </View>
      </View>
      <ButtonLargePrimary
        title={areAnyRewards ? `CLAIM ALL ≈ ${totalClaimableRewardsInUsd}$` : 'EARN TO CLAIM REWARDS'}
        disabled={!areAnyRewards}
        onPress={claimAllRewards}
      />
    </View>
  );
};
