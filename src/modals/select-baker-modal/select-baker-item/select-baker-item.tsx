import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { BakerInterface, getBakerLogoUrl } from 'src/apis/baking-bad';
import { AvatarImage } from 'src/components/avatar-image/avatar-image';
import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { TruncatedText } from 'src/components/truncated-text';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';
import { HELP_UKRAINE_BAKER_ADDRESS, EVERSTAKE_BAKER_ADDRESS, TEMPLE_BAKER_ADDRESS } from 'src/utils/known-bakers';
import { tzktUrl } from 'src/utils/linking';
import { formatToPercentStr } from 'src/utils/number-format.utils';
import { kFormatter } from 'src/utils/number.util';

import { useSelectBakerItemStyles } from './select-baker-item.styles';

interface Props extends TestIdProps {
  baker: BakerInterface;
  selected: boolean;
  onPress: EmptyFn;
}

export const SelectBakerItem: FC<Props> = ({ baker, selected, onPress, testID }) => {
  const styles = useSelectBakerItemStyles();
  const isRecommendedBaker = baker.address === TEMPLE_BAKER_ADDRESS || baker.address === EVERSTAKE_BAKER_ADDRESS;
  const isHelpUkraineBaker = baker.address === HELP_UKRAINE_BAKER_ADDRESS;
  const { metadata, isDcpNode } = useNetworkInfo();

  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const { fee, capacity, freeSpace, minBalance } = baker.delegation;
  const feeStr = formatToPercentStr(fee);
  const stakingBalance = capacity - freeSpace;

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
          <AvatarImage size={formatSize(32)} uri={getBakerLogoUrl(baker.address)} />
          <Divider size={formatSize(10)} />
          <TruncatedText style={styles.nameText}>{baker.name}</TruncatedText>
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
            <Text style={styles.cellTitle}>Delegated:</Text>
            <Text style={styles.cellValueText}>{isTruthy(stakingBalance) ? kFormatter(stakingBalance) : '--'}</Text>
          </View>
          <Divider size={formatSize(16)} />
          <View>
            <Text style={styles.cellTitle}>Space:</Text>
            <Text style={styles.cellValueText}>
              {isDefined(freeSpace) ? freeSpace.toFixed(2) : '--'} {metadata.symbol}
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
    </TouchableOpacity>
  );
};
