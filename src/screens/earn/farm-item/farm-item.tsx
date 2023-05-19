import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { getHarvestAssetsTransferParams } from 'src/apis/quipuswap-staking';
import { FarmVersionEnum, PoolType, SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { Bage } from 'src/components/bage/bage';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { FarmTokens } from 'src/components/farm-tokens/farm-tokens';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { useFarmTokens } from 'src/hooks/use-farm-tokens';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { navigateAction } from 'src/store/root-state.actions';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { useFarmItemStyles } from './farm-item.styles';

interface Props {
  farm: SingleFarmResponse;
  lastStakeRecord?: UserStakeValueInterface;
}

const FARM_PRECISION = 18;
const DEFAULT_AMOUNT = 0;
const DEFAULT_EXHANGE_RATE = 1;
const DEFAULT_DECIMALS = 2;
const REWARDS_DECIMALS = 6;
const SECONDS_IN_DAY = 86400;

export const FarmItem: FC<Props> = ({ farm, lastStakeRecord }) => {
  const styles = useFarmItemStyles();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const tezos = useReadOnlyTezosToolkit();
  const { rewardToken, stakeTokens } = useFarmTokens(farm.item);

  const apr = useMemo(
    () => (isDefined(farm.item.apr) ? new BigNumber(farm.item.apr).toFixed(DEFAULT_DECIMALS) : '---'),
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
      mutezToTz(
        new BigNumber(lastStakeRecord?.claimableRewards ?? DEFAULT_AMOUNT),
        farm.item.rewardToken.metadata.decimals
      ).multipliedBy(farm.item.earnExchangeRate ?? DEFAULT_EXHANGE_RATE),
    [lastStakeRecord?.claimableRewards]
  );

  const navigateToFarm = useCallback(
    () => navigate(ModalsEnum.ManageFarmingPool, { id: farm.item.id, version: FarmVersionEnum.V3 }),
    [farm.item.id]
  );

  const harvestAssetsApi = useCallback(async () => {
    const lastStakeId = lastStakeRecord?.lastStakeId;
    if (isDefined(lastStakeId)) {
      dispatch(
        navigateAction(ModalsEnum.Confirmation, {
          type: ConfirmationTypeEnum.InternalOperations,
          opParams: await getHarvestAssetsTransferParams(tezos, farm.item.contractAddress, lastStakeId),
          testID: 'CLAIM_REWARDS'
        })
      );
    }
  }, [lastStakeRecord?.lastStakeId, farm.item.contractAddress, tezos]);

  return (
    <View style={styles.root}>
      <View style={styles.bageContainer}>
        {farm.item.type === PoolType.STABLESWAP && <Bage text="Stable Pool" color="#46BC94" style={styles.bage} />}
        {new BigNumber(farm.item.vestingPeriodSeconds).isGreaterThan(SECONDS_IN_DAY) && <Bage text="Long Term" />}
      </View>
      <View style={styles.mainContent}>
        <View style={[styles.tokensContainer, styles.row]}>
          <FarmTokens stakeTokens={stakeTokens} rewardToken={rewardToken} />
          <View>
            <Text style={styles.apyText}>APY: {apr}%</Text>
            <View style={styles.earnSource}>
              <Icon name={IconNameEnum.QsEarnSource} />
              <Text style={styles.attributeTitle}>Quipuswap</Text>
            </View>
          </View>
        </View>

        <View style={[styles.row, styles.mb16]}>
          <View>
            <Text style={styles.attributeTitle}>Your deposit:</Text>
            <Text style={styles.attributeValue}>≈ {depositAmountAtomic.toFixed(DEFAULT_DECIMALS)}$</Text>
          </View>
          <View>
            <Text style={styles.attributeTitle}>Claimable rewards:</Text>
            <Text style={styles.attributeValue}>≈ {claimableRewardsAtomic.toFixed(REWARDS_DECIMALS)}$</Text>
          </View>
        </View>

        <View style={styles.row}>
          {depositAmountAtomic.isGreaterThan(0) ? (
            <>
              <ButtonLargeSecondary title="MANAGE" onPress={navigateToFarm} />
              <Divider size={formatSize(8)} />
              <ButtonLargePrimary title="CLAIM REWARDS" onPress={harvestAssetsApi} />
            </>
          ) : (
            <ButtonLargePrimary title="START EARNING" onPress={navigateToFarm} />
          )}
        </View>
      </View>
    </View>
  );
};
