import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AvatarImage } from '../../../components/avatar-image/avatar-image';
import { ButtonSmallDelegate } from '../../../components/button/button-small/button-small-delegate/button-small-delegate';
import { Divider } from '../../../components/divider/divider';
import { ExternalLinkButton } from '../../../components/icon/external-link-button/external-link-button';
import { PublicKeyHashText } from '../../../components/public-key-hash-text/public-key-hash-text';
import { EmptyFn } from '../../../config/general';
import { useNetworkInfo } from '../../../hooks/use-network-info.hook';
import { BakerRewardInterface } from '../../../interfaces/baker-reward.interface';
import { BakerInterface } from '../../../interfaces/baker.interface';
import { useSelectedRpcUrlSelector } from '../../../store/settings/settings-selectors';
import { formatSize } from '../../../styles/format-size';
import { isDefined } from '../../../utils/is-defined';
import { tzktUrl } from '../../../utils/linking.util';
import { kFormatter } from '../../../utils/number.util';
import { BakerRewardsList } from './baker-rewards-list/baker-rewards-list';
import { useSelectedBakerScreenStyles } from './selected-baker-screen.styles';

interface Props {
  baker: BakerInterface;
  bakerRewardsList: BakerRewardInterface[];
  onRedelegatePress: EmptyFn;
}

export const SelectedBakerScreen: FC<Props> = ({ baker, bakerRewardsList, onRedelegatePress }) => {
  const styles = useSelectedBakerScreenStyles();

  const { metadata } = useNetworkInfo();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  return (
    <>
      <View style={styles.bakerCard}>
        <View style={styles.upperContainer}>
          <View style={styles.bakerContainer}>
            <AvatarImage size={formatSize(44)} uri={baker.logo} />
            <Divider size={formatSize(10)} />
            <View style={styles.bakerContainerData}>
              <Text style={styles.nameText}>{baker.name}</Text>
              <Divider size={formatSize(2)} />
              <View style={styles.actionsContainer}>
                <PublicKeyHashText publicKeyHash={baker.address} />
                <Divider size={formatSize(4)} />
                <ExternalLinkButton url={tzktUrl(selectedRpcUrl, baker.address)} />
              </View>
            </View>
          </View>

          <ButtonSmallDelegate
            title="REDELEGATE"
            marginTop={formatSize(8)}
            marginRight={formatSize(8)}
            onPress={onRedelegatePress}
          />
        </View>

        <Divider size={formatSize(8)} />

        <View style={styles.lowerContainer}>
          <View>
            <Text style={styles.cellTitle}>Baker fee:</Text>
            <Text style={styles.cellValueText}>{isDefined(baker.fee) ? (baker.fee * 100).toFixed(2) : '--'}%</Text>
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
            <Text style={styles.cellValueText}>{kFormatter(baker.stakingBalance)}</Text>
          </View>
        </View>
      </View>

      <BakerRewardsList bakerRewards={bakerRewardsList} />
    </>
  );
};
