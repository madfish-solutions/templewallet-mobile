import React, { FC, useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { BakerInterface, getBakerLogoUrl } from 'src/apis/baking-bad';
import { AvatarImage } from 'src/components/avatar-image/avatar-image';
import { ButtonSmallDelegate } from 'src/components/button/button-small/button-small-delegate/button-small-delegate';
import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { EmptyFn } from 'src/config/general';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { BakerRewardInterface } from 'src/interfaces/baker-reward.interface';
import { useIsInAppBrowserEnabledSelector, useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';
import { openUrl, tzktUrl, useOpenUrlInAppBrowser } from 'src/utils/linking';
import { formatToPercentStr } from 'src/utils/number-format.utils';
import { kFormatter } from 'src/utils/number.util';

import { BakerRewardsList } from './baker-rewards-list/baker-rewards-list';
import { SelectedBakerScreenSelectors } from './selected-baker-screen.selectors';
import { useSelectedBakerScreenStyles } from './selected-baker-screen.styles';

const STAKING_DAPP_LINK = 'https://stake.tezos.com/';

interface Props {
  baker: BakerInterface;
  bakerRewardsList: BakerRewardInterface[];
  onRedelegatePress: EmptyFn;
}

export const SelectedBakerScreen: FC<Props> = ({ baker, bakerRewardsList, onRedelegatePress }) => {
  const styles = useSelectedBakerScreenStyles();
  const colors = useColors();

  const { metadata, isDcpNode } = useNetworkInfo();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const bakerName = isDcpNode ? 'Current Producer' : baker.name;

  const openUrlInAppBrowser = useOpenUrlInAppBrowser();
  const isInAppBrowserEnabled = useIsInAppBrowserEnabledSelector();

  const { fee, capacity, freeSpace, minBalance } = baker.delegation;
  const feeStr = formatToPercentStr(fee);
  const stakingBalance = capacity - freeSpace;

  const handleStakingPress = useCallback(
    () => (isInAppBrowserEnabled ? openUrlInAppBrowser(STAKING_DAPP_LINK) : openUrl(STAKING_DAPP_LINK)),
    [isInAppBrowserEnabled, openUrlInAppBrowser]
  );

  return (
    <>
      <View style={styles.card}>
        <View style={styles.upperContainer}>
          <View style={styles.mainContentContainer}>
            <AvatarImage size={formatSize(44)} uri={getBakerLogoUrl(baker.address)} />
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
              <Text style={styles.cellTitle}>Delegated:</Text>
              <Text style={styles.cellValueText}>{isDefined(stakingBalance) ? kFormatter(stakingBalance) : '--'}</Text>
            </View>
            <Divider size={formatSize(16)} />
            <View>
              <Text style={styles.cellTitle}>Space:</Text>
              <Text style={styles.cellValueText}>
                {isDefined(freeSpace) ? kFormatter(freeSpace) : '--'} {metadata.symbol}
              </Text>
            </View>
            <Divider size={formatSize(16)} />
            <View>
              <Text style={styles.cellTitle}>Baker fee:</Text>
              <Text style={styles.cellValueText}>{isTruthy(feeStr) ? feeStr : '--'}%</Text>
            </View>
            <Divider size={formatSize(16)} />
            <View>
              <Text style={styles.cellTitle}>Min Balance:</Text>
              <Text style={styles.cellValueText}>{isDefined(minBalance) ? `${minBalance} TEZ` : '--'}</Text>
            </View>
          </View>
        )}
      </View>

      {!isDcpNode && (
        <TouchableOpacity style={styles.card} onPress={handleStakingPress}>
          <View style={styles.upperContainer}>
            <View style={styles.mainContentContainer}>
              <View style={styles.stakeIcon}>
                <Icon name={IconNameEnum.Stake} size={formatSize(24)} />
              </View>
              <Divider size={formatSize(10)} />
              <View style={styles.bakerContainerData}>
                <Text style={styles.nameText} numberOfLines={1}>
                  Stake TEZ
                </Text>
                <Text style={styles.cellTitle} numberOfLines={1}>
                  Earn interest up to 17.5% APY
                </Text>
              </View>
            </View>
            <View style={styles.linkIcon}>
              <Icon name={IconNameEnum.ExternalLink} color={colors.blue} />
            </View>
          </View>
        </TouchableOpacity>
      )}

      <Divider size={formatSize(16)} />

      <BakerRewardsList bakerRewards={bakerRewardsList} />
    </>
  );
};
