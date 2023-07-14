import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { getHarvestAssetsTransferParams } from 'src/apis/quipuswap-staking';
import { Button } from 'src/components/button/button';
import { Divider } from 'src/components/divider/divider';
import { EarnOpportunityTokens } from 'src/components/earn-opportunity-tokens';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { useEarnOpportunityTokens } from 'src/hooks/use-earn-opportunity-tokens';
import { useInterval } from 'src/hooks/use-interval.hook';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { navigateAction } from 'src/store/root-state.actions';
import { formatSize } from 'src/styles/format-size';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
import { SECONDS_IN_DAY, SECONDS_IN_HOUR, SECONDS_IN_MINUTE, toIntegerSeconds } from 'src/utils/date.utils';
import { aprToApy, isFarm } from 'src/utils/earn.utils';
import { doAfterConfirmation } from 'src/utils/farm.utils';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { ManageEarnOpportunityModalSelectors } from '../selectors';
import { StatsItem } from './stats-item';
import { useDetailsCardStyles } from './styles';
import { useClaimRewardsButtonConfig } from './use-claim-rewards-button-config';

interface DetailsCardProps {
  earnOpportunityItem: EarnOpportunity;
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
  earnOpportunityItem,
  loading,
  stake = EMPTY_STAKE,
  shouldShowClaimRewardsButton
}) => {
  const { depositAmountAtomic = '0', claimableRewards = '0', fullReward = '0', rewardsDueDate, lastStakeId } = stake;
  const { stakedToken, depositExchangeRate, earnExchangeRate, rewardToken, apr, contractAddress } = earnOpportunityItem;
  const stakedTokenDecimals = stakedToken.metadata.decimals;
  const apy = isDefined(apr) ? aprToApy(Number(apr)) : undefined;
  const apyOrApr = isFarm(earnOpportunityItem) ? apy : Number(apr);
  const [claimPending, setClaimPending] = useState(false);
  const styles = useDetailsCardStyles();
  const claimRewardsButtonConfig = useClaimRewardsButtonConfig();
  const dispatch = useDispatch();
  const tezos = useReadOnlyTezosToolkit();
  const tokens = useEarnOpportunityTokens(earnOpportunityItem);
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
      doAfterConfirmation(
        'Your claimable rewards will be claimed and sent to you. But your full rewards will be totally lost and redistributed among other participants.',
        'Claim rewards',
        claimRewards
      );
    } else {
      void claimRewards();
    }
  }, [lastStakeId, dispatch, contractAddress, tezos, msToVestingEnd]);

  const depositAmount = useMemo(
    () => mutezToTz(new BigNumber(depositAmountAtomic), stakedTokenDecimals),
    [depositAmountAtomic, stakedTokenDecimals]
  );
  const claimableRewardAmount = useMemo(
    () => mutezToTz(new BigNumber(claimableRewards), rewardTokenDecimals),
    [claimableRewards, rewardTokenDecimals]
  );
  const fullRewardAmount = useMemo(
    () => mutezToTz(new BigNumber(fullReward), rewardTokenDecimals),
    [fullReward, rewardTokenDecimals]
  );

  return (
    <View style={styles.root}>
      <View style={styles.title}>
        <EarnOpportunityTokens {...tokens} />
        <Text style={styles.apyLabel}>
          {isFarm(earnOpportunityItem) ? 'APY' : 'APR'}: {isDefined(apyOrApr) ? `${apyOrApr.toFixed(2)}%` : '-'}
        </Text>
      </View>
      <HorizontalBorder style={styles.titleBorder} />
      {depositAmount.isZero() ? (
        <View style={styles.statsRow}>
          <StatsItem
            loading={loading}
            title="Your deposit & Rewards:"
            value={
              <FormattedAmount
                amount={depositAmount}
                style={styles.statsValue}
                symbol={tokens.stakeTokens.length === 1 ? stakedToken.metadata.symbol : 'Shares'}
              />
            }
            usdEquivalent={isDefined(depositExchangeRate) ? depositAmount.times(depositExchangeRate) : undefined}
          />
        </View>
      ) : (
        <>
          <View style={styles.statsRow}>
            <StatsItem
              loading={loading}
              title="Your deposit:"
              value={
                <FormattedAmount
                  amount={depositAmount}
                  style={styles.statsValue}
                  symbol={tokens.stakeTokens.length === 1 ? stakedToken.metadata.symbol : 'Shares'}
                />
              }
              usdEquivalent={isDefined(depositExchangeRate) ? depositAmount.times(depositExchangeRate) : undefined}
            />
            <StatsItem
              loading={loading}
              title="Claimable rewards:"
              value={
                <FormattedAmount amount={claimableRewardAmount} style={styles.statsValue} symbol={rewardTokenSymbol} />
              }
              usdEquivalent={isDefined(earnExchangeRate) ? claimableRewardAmount.times(earnExchangeRate) : undefined}
            />
          </View>

          <Divider size={formatSize(12)} />

          <View style={styles.statsRow}>
            <StatsItem
              loading={loading}
              title="Long-term rewards:"
              value={<FormattedAmount amount={fullRewardAmount} style={styles.statsValue} symbol={rewardTokenSymbol} />}
              usdEquivalent={isDefined(earnExchangeRate) ? fullRewardAmount.times(earnExchangeRate) : undefined}
            />
            <StatsItem
              loading={loading}
              title="Fully claimable:"
              value={
                <Text style={styles.statsValue}>
                  {countdownTokens.map(({ unit, value }) => (
                    <React.Fragment key={unit}>
                      {value}
                      <Text style={styles.timespanUnit}>{unit}</Text>{' '}
                    </React.Fragment>
                  ))}
                </Text>
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
            testID={ManageEarnOpportunityModalSelectors.claimRewardsButton}
            onPress={claimRewardsIfConfirmed}
          />
        </>
      )}
    </View>
  );
};
