import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AvatarImage } from '../../../components/avatar-image/avatar-image';
import { Divider } from '../../../components/divider/divider';
import { ExternalLinkButton } from '../../../components/icon/external-link-button/external-link-button';
import { PublicKeyHashText } from '../../../components/public-key-hash-text/public-key-hash-text';
import { EmptyFn } from '../../../config/general';
import { BakerInterface } from '../../../interfaces/baker.interface';
import { formatSize } from '../../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { conditionalStyle } from '../../../utils/conditional-style';
import { tzktUrl } from '../../../utils/linking.util';
import { kFormatter } from '../../../utils/number.util';
import { recommendedBakerAddress } from '../select-baker-modal';
import { useSelectBakerItemStyles } from './select-baker-item.styles';

interface Props {
  baker: BakerInterface;
  selected: boolean;
  onPress: EmptyFn;
}

export const SelectBakerItem: FC<Props> = ({ baker, selected, onPress }) => {
  const styles = useSelectBakerItemStyles();
  const isRecommendedBaker = baker.address === recommendedBakerAddress;

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
          <AvatarImage size={formatSize(32)} uri={baker.logo} />
          <Divider size={formatSize(10)} />
          <Text style={styles.nameText}>{baker.name}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <PublicKeyHashText publicKeyHash={baker.address} />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(baker.address)} />
        </View>
      </View>

      <Divider size={formatSize(8)} />

      <View style={styles.lowerContainer}>
        <View>
          <Text style={styles.cellTitle}>Baker fee:</Text>
          <Text style={styles.cellValueText}>{(baker.fee * 100).toFixed(2)}%</Text>
        </View>
        <Divider size={formatSize(16)} />
        <View>
          <Text style={styles.cellTitle}>Space:</Text>
          <Text style={styles.cellValueText}>
            {baker.freeSpace.toFixed(2)} {TEZ_TOKEN_METADATA.symbol}
          </Text>
        </View>
        <Divider size={formatSize(16)} />
        <View>
          <Text style={styles.cellTitle}>Staking:</Text>
          <Text style={styles.cellValueText}>{kFormatter(baker.stakingBalance)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
