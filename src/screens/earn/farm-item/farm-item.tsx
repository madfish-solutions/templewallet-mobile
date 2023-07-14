import { ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { getHarvestAssetsTransferParams } from 'src/apis/quipuswap-staking';
import { Bage } from 'src/components/bage/bage';
import { Button } from 'src/components/button/button';
import { Divider } from 'src/components/divider/divider';
import { FarmTokens } from 'src/components/farm-tokens/farm-tokens';
import { FormattedAmountWithLoader } from 'src/components/formatted-amount-with-loader';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';
import { useFarmTokens } from 'src/hooks/use-farm-tokens';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { navigateAction } from 'src/store/root-state.actions';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { SingleFarmResponse } from 'src/types/single-farm-response';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { aprToApy } from 'src/utils/earn.utils';
import { doAfterConfirmation } from 'src/utils/farm.utils';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { useButtonPrimaryStyleConfig } from '../button-primary.styles';
import { DEFAULT_AMOUNT, DEFAULT_DECIMALS } from '../constants';
import { useButtonSecondaryStyleConfig, useFarmItemStyles } from './farm-item.styles';
import { FarmItemSelectors } from './selectors';

interface Props {
  farm: SingleFarmResponse;
  lastStakeRecord?: UserStakeValueInterface;
  stakeIsLoading: boolean;
}

const DEFAULT_EXHANGE_RATE = 1;
const SECONDS_IN_DAY = 86400;

export const FarmItem: FC<Props> = ({ farm, lastStakeRecord, stakeIsLoading }) => {
  const colors = useColors();
  const styles = useFarmItemStyles();
  const buttonPrimaryStylesConfig = useButtonPrimaryStyleConfig();
  const buttonSecondaryStylesConfig = useButtonSecondaryStyleConfig();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const tezos = useReadOnlyTezosToolkit();
  const { rewardToken, stakeTokens } = useFarmTokens(farm.item);
  const isLiquidityBaking = farm.item.type === FarmPoolTypeEnum.LIQUIDITY_BAKING;
  const fiatToUsdRate = useFiatToUsdRateSelector();
  const { trackEvent } = useAnalytics();
  const {
    apr,
    stakedToken,
    depositExchangeRate,
    id,
    contractAddress,
    type: farmType,
    vestingPeriodSeconds
  } = farm.item;

  const apy = useMemo(() => (isDefined(apr) ? aprToApy(Number(apr)).toFixed(DEFAULT_DECIMALS) : '---'), [apr]);

  const depositAmountAtomic = useMemo(
    () =>
      mutezToTz(new BigNumber(lastStakeRecord?.depositAmountAtomic ?? DEFAULT_AMOUNT), stakedToken.metadata.decimals)
        .multipliedBy(depositExchangeRate ?? DEFAULT_EXHANGE_RATE)
        .multipliedBy(fiatToUsdRate ?? DEFAULT_EXHANGE_RATE),
    [lastStakeRecord?.depositAmountAtomic, fiatToUsdRate, depositExchangeRate, stakedToken]
  );
  const depositIsZero = depositAmountAtomic.isZero();

  const claimableRewardsAtomic = useMemo(
    () =>
      mutezToTz(
        new BigNumber(lastStakeRecord?.claimableRewards ?? DEFAULT_AMOUNT),
        farm.item.rewardToken.metadata.decimals
      )
        .multipliedBy(farm.item.earnExchangeRate ?? DEFAULT_EXHANGE_RATE)
        .multipliedBy(fiatToUsdRate ?? DEFAULT_EXHANGE_RATE),
    [lastStakeRecord?.claimableRewards, fiatToUsdRate, farm.item]
  );

  const navigateToFarm = useCallback(
    () => navigate(ModalsEnum.ManageFarmingPool, { id, contractAddress }),
    [id, contractAddress]
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

  const lastStakeId = lastStakeRecord?.lastStakeId;
  const harvestAssetsApi = useCallback(async () => {
    if (!isDefined(lastStakeId)) {
      return;
    }

    const opParams = await getHarvestAssetsTransferParams(tezos, contractAddress, lastStakeId);

    if ((lastStakeRecord?.rewardsDueDate ?? 0) > Date.now()) {
      const modalAnswerAnalyticsProperties = {
        page: ScreensEnum.Earn,
        farmId: id,
        farmContractAddress: contractAddress
      };

      doAfterConfirmation(
        'Your claimable rewards will be claimed and sent to you. But your full rewards will be totally lost and redistributed among other participants.',
        'Claim rewards',
        () => {
          trackEvent('CLAIM_REWARDS_MODAL_CONFIRM', AnalyticsEventCategory.ButtonPress, modalAnswerAnalyticsProperties);
          navigateHarvestFarm(opParams);
        },
        () =>
          trackEvent('CLAIM_REWARDS_MODAL_CANCEL', AnalyticsEventCategory.ButtonPress, modalAnswerAnalyticsProperties)
      );
    } else {
      navigateHarvestFarm(opParams);
    }
  }, [lastStakeId, lastStakeRecord?.rewardsDueDate, id, contractAddress, tezos, trackEvent]);

  const actionButtonsTestIDProperties = useMemo(
    () => ({
      id,
      contractAddress
    }),
    [id, contractAddress]
  );

  const renderStatsLoader = useCallback(() => <Text style={styles.attributeValue}>---</Text>, [styles]);

  return (
    <View style={[styles.root, styles.mb16]}>
      <View style={styles.bageContainer}>
        {farmType === FarmPoolTypeEnum.STABLESWAP && (
          <Bage text="Stable Pool" color={colors.kolibriGreen} style={styles.bage} textStyle={styles.bageText} />
        )}
        {Number(vestingPeriodSeconds) > SECONDS_IN_DAY && (
          <Bage text="Long-Term Farm" style={[styles.bage, styles.lastBage]} textStyle={styles.bageText} />
        )}
      </View>
      <View style={styles.mainContent}>
        <View style={[styles.tokensContainer, styles.row]}>
          <FarmTokens stakeTokens={stakeTokens} rewardToken={rewardToken} />
          <View style={styles.alignEnd}>
            <Text style={styles.apyText}>APY: {apy}%</Text>
            <View style={styles.earnSource}>
              {isLiquidityBaking ? (
                <View style={[styles.earnSourceIcon, styles.liquidityBakingIconWrapper]}>
                  <Icon size={formatSize(6)} name={IconNameEnum.LiquidityBakingLogo} />
                </View>
              ) : (
                <Icon style={styles.earnSourceIcon} name={IconNameEnum.QsEarnSource} size={formatSize(12)} />
              )}
              <Text style={styles.attributeTitle}>{isLiquidityBaking ? 'Liquidity Baking' : 'Quipuswap'}</Text>
            </View>
          </View>
        </View>

        <HorizontalBorder />

        <Divider size={formatSize(8)} />

        <View style={[styles.row, styles.mb16]}>
          <View style={styles.flex}>
            <Text style={styles.attributeTitle}>Your deposit:</Text>
            <FormattedAmountWithLoader
              isLoading={stakeIsLoading}
              renderLoader={renderStatsLoader}
              isDollarValue
              amount={depositAmountAtomic}
              style={styles.attributeValue}
            />
          </View>
          {!isLiquidityBaking && depositAmountAtomic.gt(0) && (
            <View style={styles.flex}>
              <Text style={styles.attributeTitle}>Claimable rewards:</Text>
              <FormattedAmountWithLoader
                isLoading={stakeIsLoading}
                renderLoader={renderStatsLoader}
                isDollarValue
                amount={claimableRewardsAtomic}
                style={styles.attributeValue}
              />
            </View>
          )}
        </View>

        <View style={styles.row}>
          {!depositIsZero && (
            <View style={styles.flex}>
              <Button title="MANAGE" isFullWidth onPress={navigateToFarm} styleConfig={buttonSecondaryStylesConfig} />
            </View>
          )}
          {!depositIsZero && !isLiquidityBaking && (
            <>
              <Divider size={formatSize(8)} />
              <View style={styles.flex}>
                <Button
                  isFullWidth
                  title="CLAIM REWARDS"
                  onPress={harvestAssetsApi}
                  styleConfig={buttonPrimaryStylesConfig}
                />
              </View>
            </>
          )}
          {depositIsZero && (
            <Button
              isFullWidth
              title="START FARMING"
              onPress={navigateToFarm}
              styleConfig={buttonPrimaryStylesConfig}
              testID={FarmItemSelectors.startFarmingButton}
              testIDProperties={actionButtonsTestIDProperties}
            />
          )}
        </View>
      </View>
    </View>
  );
};
