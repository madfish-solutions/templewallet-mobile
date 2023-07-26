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
import { TestIdProps } from 'src/interfaces/test-id.props';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';
import { HELP_UKRAINE_BAKER_ADDRESS, RECOMMENDED_BAKER_ADDRESS } from 'src/utils/known-bakers';
import { tzktUrl } from 'src/utils/linking';
import { formatToPercentStr } from 'src/utils/number-format.utils';
import { kFormatter } from 'src/utils/number.util';
import { getTruncatedProps } from 'src/utils/style.util';

import { useSelectBakerItemStyles } from './select-baker-item.styles';

interface Props extends TestIdProps {
  baker: BakerInterface;
  selected: boolean;
  onPress: EmptyFn;
}

export const SelectBakerItem: FC<Props> = ({ baker, selected, onPress, testID }) => {
  const styles = useSelectBakerItemStyles();
  const isRecommendedBaker = baker.address === RECOMMENDED_BAKER_ADDRESS;
  const isHelpUkraineBaker = baker.address === HELP_UKRAINE_BAKER_ADDRESS;
  const { metadata, isDcpNode } = useNetworkInfo();

  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const feeStr = formatToPercentStr(baker.fee);

  return (
    <TouchableOpacity
      style={[styles.container, conditionalStyle(selected, styles.containerSelected)]}
      onPress={onPress}
      testID={testID}
    >
      {(isRecommendedBaker || isHelpUkraineBaker) && (
        <View style={styles.recommendedContainer}>
          <Text style={styles.recommendedText}>{isRecommendedBaker ? 'Recommended ' : 'Help Ukraine 🇺🇦'}</Text>
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
          <Text {...getTruncatedProps(styles.nameText)}>{baker.name}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <PublicKeyHashText style={styles.accountPkh} publicKeyHash={baker.address} />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(selectedRpcUrl, baker.address)} />
        </View>
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
              {isTruthy(baker.stakingBalance) ? kFormatter(baker.stakingBalance) : '--'}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};
