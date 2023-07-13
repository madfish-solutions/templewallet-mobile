import React, { FC, useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { getHarvestAssetsTransferParams } from 'src/apis/quipuswap-staking';
import { Farm } from 'src/apis/quipuswap-staking/types';
import { Button } from 'src/components/button/button';
import { Divider } from 'src/components/divider/divider';
import { FarmTokens } from 'src/components/farm-tokens/farm-tokens';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { useAssetAmount } from 'src/hooks/use-asset-amount.hook';
import { useFarmTokens } from 'src/hooks/use-farm-tokens';
import { useInterval } from 'src/hooks/use-interval.hook';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { navigateAction } from 'src/store/root-state.actions';
import { formatSize } from 'src/styles/format-size';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { SECONDS_IN_DAY, SECONDS_IN_HOUR, SECONDS_IN_MINUTE, toIntegerSeconds } from 'src/utils/date.utils';
import { aprToApy } from 'src/utils/earn.utils';
import { doAfterConfirmation } from 'src/utils/farm.utils';
import { isDefined } from 'src/utils/is-defined';

import { ManageFarmingPoolModalSelectors } from '../selectors';
import { StatsItem } from './stats-item';
import { useDetailsCardStyles } from './styles';
import { useClaimRewardsButtonConfig } from './use-claim-rewards-button-config';

interface DetailsCardProps {
  farm: Farm;
  loading: boolean;
  stake?: UserStakeValueInterface;
  shouldShowClaimRewardsButton: boolean;
}

const EMPTY_STAKE: UserStakeValueInterface = {};
const COUNTDOWN_TOKENS_BASE = [
  { unit: 'D', seconds: SECONDS_IN_DAY },
  { unit: 'H', seconds: SECONDS_IN_HOUR },
  { unit: 'M', seconds: SECONDS_IN_MINUTE }
];

export const DetailsCard: FC<DetailsCardProps> = ({
  farm,
  loading,
  stake = EMPTY_STAKE,
  shouldShowClaimRewardsButton
}) => {
  const { depositAmountAtomic = '0', claimableRewards = '0', fullReward = '0', rewardsDueDate, lastStakeId } = stake;
  const { stakedToken, depositExchangeRate, earnExchangeRate, rewardToken, apr, contractAddress } = farm;
  const stakedTokenDecimals = stakedToken.metadata.decimals;
  const apy = isDefined(apr) ? aprToApy(Number(apr)) : undefined;
  const [claimPending, setClaimPending] = useState(false);
  const styles = useDetailsCardStyles();
  const claimRewardsButtonConfig = useClaimRewardsButtonConfig();
  const dispatch = useDispatch();
  const tezos = useReadOnlyTezosToolkit();
  const farmTokens = useFarmTokens(farm);
  const { trackEvent } = useAnalytics();
  const rewardTokenDecimals = rewardToken.metadata.decimals;
  const rewardTokenSymbol = rewardToken.metadata.symbol;

  const getMsToVestingEnd = useCallback(
    () => (isDefined(rewardsDueDate) ? Math.max(0, rewardsDueDate - Date.now()) : 0),
    [rewardsDueDate]
  );
  const [msToVestingEnd, setMsToVestingEnd] = useState(getMsToVestingEnd());
  useInterval(
    () => {
      setMsToVestingEnd(getMsToVestingEnd());
    },
    1000,
    [getMsToVestingEnd]
  );
  const secondsToVestingEnd = toIntegerSeconds(msToVestingEnd);
  const countdownTokens = useMemo(
    () =>
      COUNTDOWN_TOKENS_BASE.map(({ unit, seconds }, index) => ({
        unit,
        value: (
          Math.floor(secondsToVestingEnd / seconds) %
          ((COUNTDOWN_TOKENS_BASE[index - 1]?.seconds ?? Infinity) / seconds)
        )
          .toString()
          .padStart(2, '0')
      })),
    [secondsToVestingEnd]
  );

  const claimRewardsIfConfirmed = useCallback(() => {
    if (!isDefined(lastStakeId)) {
      return;
    }

    const claimRewards = async () => {
      try {
        setClaimPending(true);
        dispatch(
          navigateAction(ModalsEnum.Confirmation, {
            type: ConfirmationTypeEnum.InternalOperations,
            opParams: await getHarvestAssetsTransferParams(tezos, contractAddress, lastStakeId),
            testID: 'CLAIM_REWARDS'
          })
        );
      } catch (e) {
        showErrorToastByError(e);
      } finally {
        setClaimPending(false);
      }
    };

    if (msToVestingEnd > 0) {
      const modalAnswerAnalyticsProperties = {
        page: ModalsEnum.ManageFarmingPool,
        farmId: farm.id,
        farmContractAddress: farm.contractAddress
      };

      doAfterConfirmation(
        'Your claimable rewards will be claimed and sent to you. But your full rewards will be totally lost and redistributed among other participants.',
        'Claim rewards',
        () => {
          trackEvent('CLAIM_REWARDS_MODAL_CONFIRM', AnalyticsEventCategory.ButtonPress, modalAnswerAnalyticsProperties);
          void claimRewards();
        },
        () =>
          trackEvent('CLAIM_REWARDS_MODAL_CANCEL', AnalyticsEventCategory.ButtonPress, modalAnswerAnalyticsProperties)
      );
    } else {
      void claimRewards();
    }
  }, [lastStakeId, dispatch, contractAddress, tezos, msToVestingEnd, farm, trackEvent]);

  const { assetAmount: depositAmount, usdEquivalent: depositUsdEquivalent } = useAssetAmount(
    depositAmountAtomic,
    stakedTokenDecimals,
    depositExchangeRate
  );
  const { assetAmount: claimableRewardAmount, usdEquivalent: claimableRewardUsdEquivalent } = useAssetAmount(
    claimableRewards,
    rewardTokenDecimals,
    earnExchangeRate
  );
  const { assetAmount: fullRewardAmount, usdEquivalent: fullRewardUsdEquivalent } = useAssetAmount(
    fullReward,
    rewardTokenDecimals,
    earnExchangeRate
  );

  return (
    <View style={styles.root}>
      <View style={styles.title}>
        <FarmTokens {...farmTokens} />
        <Text style={styles.apyLabel}>APY: {isDefined(apy) ? `${apy.toFixed(2)}%` : '-'}</Text>
      </View>
      <HorizontalBorder style={styles.titleBorder} />
      {depositAmount.isZero() ? (
        <View style={styles.statsRow}>
          <StatsItem
            loading={false}
            title="Your deposit & Rewards:"
            value={<FormattedAmount amount={depositAmount} style={styles.statsValue} symbol="Shares" />}
            usdEquivalent={depositUsdEquivalent}
          />
        </View>
      ) : (
        <>
          <View style={styles.statsRow}>
            <StatsItem
              loading={loading}
              title="Your deposit:"
              value={<FormattedAmount amount={depositAmount} style={styles.statsValue} symbol="Shares" />}
              usdEquivalent={depositUsdEquivalent}
            />
            <StatsItem
              loading={loading}
              title="Claimable rewards:"
              value={
                <FormattedAmount amount={claimableRewardAmount} style={styles.statsValue} symbol={rewardTokenSymbol} />
              }
              usdEquivalent={claimableRewardUsdEquivalent}
            />
          </View>
          <Divider size={formatSize(12)} />
          <View style={styles.statsRow}>
            <StatsItem
              loading={loading}
              title="Long-term rewards:"
              value={<FormattedAmount amount={fullRewardAmount} style={styles.statsValue} symbol={rewardTokenSymbol} />}
              usdEquivalent={fullRewardUsdEquivalent}
            />
            <StatsItem
              loading={loading}
              title="Fully claimable:"
              value={
                <View style={styles.timespanValue}>
                  {countdownTokens.map(({ unit, value }) => (
                    <React.Fragment key={unit}>
                      <Text style={styles.statsValue}>{value}</Text>
                      <Divider size={formatSize(2)} />
                      <Text style={styles.timespanUnit}>{unit}</Text>
                      <Divider size={formatSize(6)} />
                    </React.Fragment>
                  ))}
                </View>
              }
            />
          </View>
        </>
      )}
      {shouldShowClaimRewardsButton && (
        <>
          <Divider size={formatSize(16)} />
          <Button
            styleConfig={claimRewardsButtonConfig}
            isFullWidth
            disabled={claimableRewardAmount.isZero() || claimPending}
            title={claimableRewardAmount.isZero() ? 'EARN TO CLAIM REWARDS' : 'CLAIM REWARDS'}
            testID={ManageFarmingPoolModalSelectors.claimRewardsButton}
            onPress={claimRewardsIfConfirmed}
          />
        </>
      )}
    </View>
  );
};
