import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { BakerInterface } from 'src/apis/baking-bad';
import { AvatarImage } from 'src/components/avatar-image/avatar-image';
import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { EmptyFn } from 'src/config/general';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';
import { tzktUrl } from 'src/utils/linking.util';
import { formatToPercentStr } from 'src/utils/number-format.utils';
import { kFormatter } from 'src/utils/number.util';

import { RECOMMENDED_BAKER_ADDRESS } from '../select-baker-modal';
import { useSelectBakerItemStyles } from './select-baker-item.styles';

interface Props {
  baker: BakerInterface;
  selected: boolean;
  onPress: EmptyFn;
}

export const SelectBakerItem: FC<Props> = ({ baker, selected, onPress }) => {
  const styles = useSelectBakerItemStyles();
  const isRecommendedBaker = baker.address === RECOMMENDED_BAKER_ADDRESS;
  const { metadata } = useNetworkInfo();

  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const feeStr = formatToPercentStr(baker.fee);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        conditionalStyle(selected, styles.containerSelected),
        conditionalStyle(isRecommendedBaker, styles.containerPaddingWithRecommended)
      ]}
      onPress={onPress}
    >
      {isRecommendedBaker && (
        <View style={styles.recommendedContainer}>
          <Text style={styles.recommendedText}>Recommended</Text>
        </View>
      )}

      <View style={styles.upperContainer}>
        <View style={styles.bakerContainerData}>
          {baker.logo ? (
            <AvatarImage size={formatSize(32)} uri={baker.logo} />
          ) : (
            <RobotIcon size={formatSize(32)} seed={baker.address} />
          )}
          <Divider size={formatSize(10)} />
          <Text style={styles.nameText}>{baker.name}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <PublicKeyHashText style={styles.accountPkh} publicKeyHash={baker.address} />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(selectedRpcUrl, baker.address)} />
        </View>
      </View>

      <Divider size={formatSize(8)} />

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
            {isTruthy(baker.stakingBalance) ? kFormatter(baker.stakingBalance) : '--'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
