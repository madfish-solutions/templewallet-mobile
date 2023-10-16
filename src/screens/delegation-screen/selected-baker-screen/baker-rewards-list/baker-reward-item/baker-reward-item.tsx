import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { AvatarImage } from 'src/components/avatar-image/avatar-image';
import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useBakersListSelector } from 'src/store/baking/baking-selectors';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { isTruthy } from 'src/utils/is-truthy';
import { tzktUrl } from 'src/utils/linking';
import { formatToPercentStr } from 'src/utils/number-format.utils';
import { mutezToTz } from 'src/utils/tezos.util';

import { RewardsStatsCalculationParams } from '../interfaces/rewards-stats-calculation-params';
import { CycleStatus, getCycleStatusIcon } from '../utils/get-cycle-status-icon';
import { getRewardsStats } from '../utils/get-rewards-stats';
import { BakerRewardItemDetails } from './baker-reward-item-details/baker-reward-item-details';
import { useBakerRewardItemStyles } from './baker-reward-item.styles';

export const BakerRewardItem: FC<Omit<RewardsStatsCalculationParams, 'bakerDetails'>> = ({
  reward,
  currentCycle,
  fallbackRewardPerEndorsement,
  fallbackRewardPerFutureBlock,
  fallbackRewardPerFutureEndorsement,
  fallbackRewardPerOwnBlock
}) => {
  const styles = useBakerRewardItemStyles();

  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const bakersList = useBakersListSelector();

  const { metadata, isDcpNode } = useNetworkInfo();

  const bakerAddress = reward.baker.address;

  const bakerDetails = useMemo(
    () => bakersList.find(baker => baker.address === bakerAddress),
    [bakersList, bakerAddress]
  );

  const { ownBlocks, endorsements, missedOwnBlocks, missedEndorsements } = reward;

  const { balance, rewards, luck, bakerFeePart, bakerFee, cycleStatus, efficiency } = getRewardsStats({
    reward,
    bakerDetails,
    currentCycle,
    fallbackRewardPerEndorsement,
    fallbackRewardPerFutureBlock,
    fallbackRewardPerFutureEndorsement,
    fallbackRewardPerOwnBlock
  });

  const normalizedBalance = mutezToTz(new BigNumber(balance), 6);
  const normalizedRewards = mutezToTz(new BigNumber(rewards), 6);
  const luckPercentage = luck.times(100);
  const normalizedBakerFee = mutezToTz(new BigNumber(bakerFee), 6);
  const efficiencyPercentage = efficiency.multipliedBy(100);

  const efficiencyTextStyle = (() => {
    switch (true) {
      case cycleStatus === CycleStatus.IN_PROGRESS:
        return styles.textBlue;
      case efficiencyPercentage.gte(100):
        return styles.textGreen;
      case efficiencyPercentage.gte(99):
        return styles.textGray;
      default:
        return styles.textRed;
    }
  })();

  const luckTextStyle = (() => {
    switch (true) {
      case luckPercentage.lt(-5):
        return styles.textRed;
      case luckPercentage.gt(5):
        return styles.textGreen;
      default:
        return styles.textGray;
    }
  })();

  const isDetailsButtonVisible = useMemo(
    () => ownBlocks > 0 || endorsements > 0 || missedOwnBlocks > 0 || missedEndorsements > 0,
    [ownBlocks, endorsements, missedOwnBlocks, missedEndorsements]
  );

  const feeStr = formatToPercentStr(bakerFeePart);
  const expectedPayout = normalizedRewards.minus(normalizedBakerFee).toString();

  return (
    <View style={styles.rewardContainer}>
      <View style={styles.rewardBasicInfoContainer}>
        <View style={styles.row}>
          {bakerDetails && bakerDetails.logo ? (
            <AvatarImage size={formatSize(44)} uri={bakerDetails.logo} />
          ) : (
            <RobotIcon size={formatSize(44)} seed={reward.baker.address} />
          )}
          <Divider size={formatSize(10)} />
          <View style={styles.column}>
            <Text style={styles.bakerAlias}>{reward.baker.alias}</Text>
            <Divider size={formatSize(2)} />
            <View style={styles.row}>
              <PublicKeyHashText style={styles.accountPkh} publicKeyHash={reward.baker.address} />
              <Divider size={formatSize(4)} />
              <ExternalLinkButton url={tzktUrl(selectedRpcUrl, reward.baker.address)} />
            </View>
            <View style={styles.cellContainer}>
              <Text style={styles.cellTitle}>Delegated:</Text>
              <Text style={styles.textBlack}>
                {normalizedBalance.lt(1) ? '<1' : normalizedBalance.decimalPlaces(0, BigNumber.ROUND_FLOOR).toString()}
                {` ${metadata.symbol} `}
              </Text>
            </View>
            <View style={styles.cellContainer}>
              <Text style={styles.cellTitle}>Rewards & Luck:</Text>
              <Text style={styles.textBlack}>
                {`${normalizedRewards.toString()} ${metadata.symbol} `}
                <Text style={luckTextStyle}>
                  ({luckPercentage.gt(0) ? '+' : ''}
                  {luckPercentage.decimalPlaces(0).toString()}%)
                </Text>
              </Text>
            </View>
            <View style={styles.cellContainer}>
              <Text style={styles.cellTitle}>{isDcpNode ? 'Producer' : 'Baker'} fee:</Text>
              <Text style={styles.textBlack}>
                {isTruthy(feeStr) ? feeStr : '--'}%
                <Text style={styles.textGray}>
                  {' '}
                  ({normalizedBakerFee.toString()} {metadata.symbol})
                </Text>
              </Text>
            </View>
            <View style={styles.cellContainer}>
              <Text style={styles.cellTitle}>Expected payout:</Text>
              <Text style={styles.textBlack}>
                {cycleStatus === CycleStatus.FUTURE ? '‒' : `${expectedPayout} ${metadata.symbol}`}
              </Text>
            </View>
            <View style={styles.cellContainer}>
              <Text style={styles.cellTitle}>Efficiency:</Text>
              <Text style={cycleStatus === CycleStatus.FUTURE ? styles.textBlack : efficiencyTextStyle}>
                {cycleStatus === CycleStatus.FUTURE ? '‒' : efficiencyPercentage.decimalPlaces(2).toString() + '%'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rightContainer}>
          <View style={styles.rowAlignCenter}>
            <Text style={styles.textBlack}>{reward.cycle}</Text>
            <Divider size={formatSize(4)} />
            <Icon name={getCycleStatusIcon(cycleStatus)} size={formatSize(16)} />
          </View>
          {isDetailsButtonVisible && (
            <TouchableOpacity style={styles.row} onPress={() => setIsDetailsOpen(!isDetailsOpen)}>
              <Text style={styles.detailsButtonText}>Details</Text>
              <Icon name={isDetailsOpen ? IconNameEnum.DetailsArrowUp : IconNameEnum.DetailsArrowDown} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isDetailsOpen && <BakerRewardItemDetails reward={reward} />}
    </View>
  );
};
