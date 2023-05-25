import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useMemo } from 'react';
import { View, Text, Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { FarmVersionEnum, PoolType, SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { Bage } from 'src/components/bage/bage';
import { Button } from 'src/components/button/button';
import { Divider } from 'src/components/divider/divider';
import { FormattedAmount } from 'src/components/formatted-amount';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { FarmToken } from 'src/interfaces/earn.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { navigateAction } from 'src/store/root-state.actions';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { aprToApy } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { FarmTokens } from '../farm-tokens/farm-tokens';
import { useButtonPrimaryStyleConfig, useButtonSecondaryStyleConfig, useFarmItemStyles } from './farm-item.styles';

interface Props {
  farm: SingleFarmResponse;
  lastStakeRecord?: UserStakeValueInterface;
}

const FARM_PRECISION = 18;
const DEFAULT_AMOUNT = 0;
const DEFAULT_EXHANGE_RATE = 1;
const DEFAULT_DECIMALS = 2;
const SECONDS_IN_DAY = 86400;

export const FarmItem: FC<Props> = ({ farm, lastStakeRecord }) => {
  const styles = useFarmItemStyles();
  const buttonPrimaryStylesConfig = useButtonPrimaryStyleConfig();
  const buttonSecondaryStylesConfig = useButtonSecondaryStyleConfig();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);

  const rewardToken: FarmToken = useMemo(
    () => ({
      symbol: farm.item.rewardToken.metadata.symbol,
      thumbnailUri: farm.item.rewardToken.metadata.thumbnailUri
    }),
    [farm.item.rewardToken.metadata]
  );

  const stakeTokens = useMemo(
    () =>
      farm.item.tokens.map(token => {
        const result: FarmToken = {
          symbol: token.metadata.symbol,
          thumbnailUri: token.metadata.thumbnailUri
        };

        if (token.metadata.symbol.toLowerCase() === TEZ_TOKEN_SLUG) {
          result.iconName = IconNameEnum.TezToken;
        }

        return result;
      }),
    [farm.item.tokens]
  );

  const apr = useMemo(
    () => (isDefined(farm.item.apr) ? aprToApy(Number(farm.item.apr)).toFixed(DEFAULT_DECIMALS) : '---'),
    [farm.item.apr]
  );

  const depositAmountAtomic = useMemo(
    () =>
      mutezToTz(new BigNumber(lastStakeRecord?.depositAmountAtomic ?? DEFAULT_AMOUNT), FARM_PRECISION).multipliedBy(
        farm.item.depositExchangeRate ?? DEFAULT_EXHANGE_RATE
      ),
    [lastStakeRecord?.depositAmountAtomic]
  );

  const claimableRewardsAtomic = useMemo(
    () =>
      mutezToTz(new BigNumber(lastStakeRecord?.claimableRewards ?? DEFAULT_AMOUNT), FARM_PRECISION).multipliedBy(
        farm.item.earnExchangeRate ?? DEFAULT_EXHANGE_RATE
      ),
    [lastStakeRecord?.claimableRewards]
  );

  const navigateToFarm = useCallback(
    () => navigate(ModalsEnum.ManageFarmingPool, { id: farm.item.id, version: FarmVersionEnum.V3 }),
    [farm.item.id]
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

  const harvestAssetsApi = useCallback(async () => {
    if (isDefined(lastStakeRecord?.lastStakeId)) {
      const farmingContract = await tezos.wallet.at(farm.item.contractAddress);
      const claimParams = farmingContract.methods.claim(lastStakeRecord?.lastStakeId).toTransferParams();
      const opParams: Array<ParamsWithKind> = [claimParams].map(transferParams => ({
        ...transferParams,
        kind: OpKind.TRANSACTION
      }));

      if ((lastStakeRecord?.rewardsDueDate ?? 0) > Date.now()) {
        Alert.alert(
          'Are you sure?',
          'It is a long-term farm. Your claimable rewards will be claimed along with your withdrawal. All further rewards will be lost',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Claim rewards',
              style: 'destructive',
              onPress: () => navigateHarvestFarm(opParams)
            }
          ]
        );
      } else {
        navigateHarvestFarm(opParams);
      }
    }
  }, [lastStakeRecord?.lastStakeId, farm.item.contractAddress]);

  return (
    <View style={[styles.root, styles.mb16]}>
      <View style={styles.bageContainer}>
        {farm.item.type === PoolType.STABLESWAP && <Bage text="Stable Pool" color="#46BC94" style={styles.bage} />}
        {new BigNumber(farm.item.vestingPeriodSeconds).isGreaterThan(SECONDS_IN_DAY) && <Bage text="Long-Term Farm" />}
      </View>
      <View style={styles.mainContent}>
        <View style={[styles.tokensContainer, styles.row]}>
          <FarmTokens stakeTokens={stakeTokens} rewardToken={rewardToken} />
          <View>
            <Text style={styles.apyText}>APY: {apr}%</Text>
            <View style={styles.earnSource}>
              <Icon style={styles.earnSourceIcon} name={IconNameEnum.QsEarnSource} />
              <Text style={styles.attributeTitle}>Quipuswap</Text>
            </View>
          </View>
        </View>

        <View style={[styles.row, styles.mb16]}>
          <View style={styles.flex}>
            <Text style={styles.attributeTitle}>Your deposit:</Text>
            <FormattedAmount isDollarValue amount={depositAmountAtomic} style={styles.attributeValue} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.attributeTitle}>Claimable rewards:</Text>
            <FormattedAmount isDollarValue amount={claimableRewardsAtomic} style={styles.attributeValue} />
          </View>
        </View>

        <View style={styles.row}>
          {new BigNumber(depositAmountAtomic).isGreaterThan(DEFAULT_AMOUNT) ? (
            <>
              <Button title="MANAGE" onPress={navigateToFarm} styleConfig={buttonSecondaryStylesConfig} />
              <Divider size={formatSize(8)} />
              <Button
                isFullWidth
                title="CLAIM REWARDS"
                onPress={harvestAssetsApi}
                styleConfig={buttonPrimaryStylesConfig}
              />
            </>
          ) : (
            <Button
              isFullWidth
              title="START FARMING"
              onPress={navigateToFarm}
              styleConfig={buttonPrimaryStylesConfig}
            />
          )}
        </View>
      </View>
    </View>
  );
};
