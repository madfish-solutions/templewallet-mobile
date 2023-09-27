import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { BakerInterface } from 'src/apis/baking-bad';
import { AvatarImage } from 'src/components/avatar-image/avatar-image';
import { ButtonSmallDelegate } from 'src/components/button/button-small/button-small-delegate/button-small-delegate';
import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { EmptyFn } from 'src/config/general';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { BakerRewardInterface } from 'src/interfaces/baker-reward.interface';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';
import { tzktUrl } from 'src/utils/linking';
import { formatToPercentStr } from 'src/utils/number-format.utils';
import { kFormatter } from 'src/utils/number.util';

import { BakerRewardsList } from './baker-rewards-list/baker-rewards-list';
import { SelectedBakerScreenSelectors } from './selected-baker-screen.selectors';
import { useSelectedBakerScreenStyles } from './selected-baker-screen.styles';

interface Props {
  baker: BakerInterface;
  bakerRewardsList: BakerRewardInterface[];
  onRedelegatePress: EmptyFn;
}

export const SelectedBakerScreen: FC<Props> = ({ baker, bakerRewardsList, onRedelegatePress }) => {
  const styles = useSelectedBakerScreenStyles();

  const { metadata, isDcpNode } = useNetworkInfo();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const bakerName = isDcpNode ? 'Current Producer' : baker.name;

  const feeStr = formatToPercentStr(baker.fee);

  return (
    <>
      <View style={styles.bakerCard}>
        <View style={styles.upperContainer}>
          <View style={styles.bakerContainer}>
            {baker.logo ? (
              <AvatarImage size={formatSize(44)} uri={baker.logo} />
            ) : (
              <RobotIcon size={formatSize(44)} seed={baker.address} />
            )}
            <Divider size={formatSize(10)} />
            <View style={styles.bakerContainerData}>
              <Text style={styles.nameText} numberOfLines={1}>
                {bakerName}
              </Text>
              <Divider size={formatSize(2)} />
              <View style={styles.actionsContainer}>
                <PublicKeyHashText style={styles.accountPkh} publicKeyHash={baker.address} />
                <Divider size={formatSize(4)} />
                <ExternalLinkButton
                  url={tzktUrl(selectedRpcUrl, baker.address)}
                  testID={SelectedBakerScreenSelectors.selectedBakerTZKTlink}
                />
              </View>
            </View>
          </View>

          <ButtonSmallDelegate
            title="REDELEGATE"
            marginTop={formatSize(8)}
            marginRight={formatSize(8)}
            onPress={onRedelegatePress}
            testID={SelectedBakerScreenSelectors.redelegateButton}
          />
        </View>

        <Divider size={formatSize(8)} />

        {!isDcpNode && (
          <View style={styles.lowerContainer}>
            <View>
              <Text style={styles.cellTitle}>Baker fee:</Text>
              <Text style={styles.cellValueText}>{isTruthy(feeStr) ? feeStr : '--'}%</Text>
            </View>
            <Divider size={formatSize(16)} />
            <View>
              <Text style={styles.cellTitle}>Space:</Text>
              <Text style={styles.cellValueText}>
                {isDefined(baker.freeSpace) ? baker.freeSpace.toFixed(2) : '--'} {metadata.symbol}
              </Text>
            </View>
            <Divider size={formatSize(16)} />
            <View>
              <Text style={styles.cellTitle}>Staking:</Text>
              <Text style={styles.cellValueText}>
                {isDefined(baker.stakingBalance) ? kFormatter(baker.stakingBalance) : '--'}
              </Text>
            </View>
          </View>
        )}
      </View>

      <BakerRewardsList bakerRewards={bakerRewardsList} />
    </>
  );
};
