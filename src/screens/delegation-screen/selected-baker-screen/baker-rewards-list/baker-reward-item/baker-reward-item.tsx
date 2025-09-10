import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { getBakerLogoUrl } from 'src/apis/baking-bad';
import { AvatarImage } from 'src/components/avatar-image/avatar-image';
import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { isString } from 'src/utils/is-string';
import { isTruthy } from 'src/utils/is-truthy';
import { tzktUrl } from 'src/utils/linking';
import { formatToPercentStr } from 'src/utils/number-format.utils';

import { BakingHistoryEntry } from '../interfaces/baking-history-entry';
import { CycleStatus, getCycleStatusIcon } from '../utils/get-cycle-status-icon';

import { BakerRewardItemDetails } from './baker-reward-item-details/baker-reward-item-details';
import { useBakerRewardItemStyles } from './baker-reward-item.styles';

export const BakerRewardItem: FC<{ item: BakingHistoryEntry }> = ({ item }) => {
  const {
    cycle,
    luck,
    efficiency,
    bakerAddress,
    bakerName,
    bakerFee,
    bakerFeeRatio,
    blocks,
    delegated,
    totalRewards,
    attestations,
    missedBlocks,
    missedAttestations,
    status,
    expectedPayout
  } = item;

  const styles = useBakerRewardItemStyles();

  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { metadata, isDcpNode } = useNetworkInfo();

  const luckPercentage = luck.times(100);
  const efficiencyPercentage = efficiency.multipliedBy(100);

  const efficiencyTextStyle = (() => {
    switch (true) {
      case status === CycleStatus.IN_PROGRESS:
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
    () => blocks > 0 || attestations > 0 || missedBlocks > 0 || missedAttestations > 0,
    [blocks, attestations, missedBlocks, missedAttestations]
  );

  const feeStr = formatToPercentStr(bakerFeeRatio);

  return (
    <View style={styles.rewardContainer}>
      <View style={styles.rewardBasicInfoContainer}>
        <View style={styles.row}>
          <AvatarImage size={formatSize(44)} uri={getBakerLogoUrl(bakerAddress)} />
          <Divider size={formatSize(10)} />
          <View style={styles.column}>
            <Text style={styles.bakerAlias}>{isString(bakerName) ? bakerName : 'Unknown baker'}</Text>
            <Divider size={formatSize(2)} />
            <View style={styles.row}>
              <PublicKeyHashText style={styles.accountPkh} publicKeyHash={bakerAddress} />
              <Divider size={formatSize(4)} />
              <ExternalLinkButton url={tzktUrl(selectedRpcUrl, bakerAddress)} />
            </View>
            <View style={styles.cellContainer}>
              <Text style={styles.cellTitle}>Delegated:</Text>
              <Text style={styles.textBlack}>
                {delegated.lt(1) ? '<1' : delegated.decimalPlaces(0, BigNumber.ROUND_FLOOR).toString()}
                {` ${metadata.symbol} `}
              </Text>
            </View>
            {status === CycleStatus.UNLOCKED && (
              <View style={styles.cellContainer}>
                <Text style={styles.cellTitle}>Rewards & Luck:</Text>
                <Text style={styles.textBlack}>
                  {`${totalRewards.toString()} ${metadata.symbol} `}
                  <Text style={luckTextStyle}>
                    ({luckPercentage.gt(0) ? '+' : ''}
                    {luckPercentage.decimalPlaces(0).toString()}%)
                  </Text>
                </Text>
              </View>
            )}
            <View style={styles.cellContainer}>
              <Text style={styles.cellTitle}>{isDcpNode ? 'Producer' : 'Baker'} fee:</Text>
              <Text style={styles.textBlack}>
                {isTruthy(feeStr) ? feeStr : '--'}%
                <Text style={styles.textGray}>
                  {' '}
                  ({bakerFee.toString()} {metadata.symbol})
                </Text>
              </Text>
            </View>
            <View style={styles.cellContainer}>
              <Text style={styles.cellTitle}>Expected payout:</Text>
              <Text style={styles.textBlack}>{`${expectedPayout} ${metadata.symbol}`}</Text>
            </View>
            {status === CycleStatus.UNLOCKED && (
              <View style={styles.cellContainer}>
                <Text style={styles.cellTitle}>Efficiency:</Text>
                <Text style={efficiencyTextStyle}>{efficiencyPercentage.decimalPlaces(2).toString() + '%'}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.rightContainer}>
          <View style={styles.rowAlignCenter}>
            <Text style={styles.textBlack}>{cycle}</Text>
            <Divider size={formatSize(4)} />
            <Icon name={getCycleStatusIcon(status)} size={formatSize(16)} />
          </View>
          {isDetailsButtonVisible && (
            <TouchableOpacity style={styles.row} onPress={() => setIsDetailsOpen(!isDetailsOpen)}>
              <Text style={styles.detailsButtonText}>Details</Text>
              <Icon name={isDetailsOpen ? IconNameEnum.DetailsArrowUp : IconNameEnum.DetailsArrowDown} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isDetailsOpen && <BakerRewardItemDetails item={item} />}
    </View>
  );
};
