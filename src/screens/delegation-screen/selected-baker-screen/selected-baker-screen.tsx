import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AvatarImage } from '../../../components/avatar-image/avatar-image';
import { ButtonDelegateSecondary } from '../../../components/button/button-large/button-delegate-secondary/button-delegate-secondary';
import { ButtonSmallDelegate } from '../../../components/button/button-small/button-small-delegate/button-small-delegate';
import { Divider } from '../../../components/divider/divider';
import { ExternalLinkButton } from '../../../components/icon/external-link-button/external-link-button';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { PublicKeyHashText } from '../../../components/public-key-hash-text/public-key-hash-text';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { TextLink } from '../../../components/text-link/text-link';
import { EmptyFn } from '../../../config/general';
import { BakerInterface } from '../../../interfaces/baker.interface';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { TEZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { isDefined } from '../../../utils/is-defined';
import { openUrl, tzktUrl } from '../../../utils/linking.util';
import { kFormatter } from '../../../utils/number.util';
import { useSelectedBakerScreenStyles } from './selected-baker-screen.styles';

interface Props {
  baker: BakerInterface;
  onRedelegatePress: EmptyFn;
}

export const SelectedBakerScreen: FC<Props> = ({ baker, onRedelegatePress }) => {
  const colors = useColors();
  const styles = useSelectedBakerScreenStyles();

  return (
    <>
      <View style={styles.bakerCard}>
        <View style={styles.upperContainer}>
          <View style={styles.bakerContainer}>
            <AvatarImage uri={baker.logo} />
            <Divider size={formatSize(10)} />
            <View style={styles.bakerContainerData}>
              <Text style={styles.nameText}>{baker.name}</Text>
              <Divider size={formatSize(2)} />
              <View style={styles.actionsContainer}>
                <PublicKeyHashText publicKeyHash={baker.address} />
                <Divider size={formatSize(4)} />
                <ExternalLinkButton url={tzktUrl(baker.address)} />
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
              {isDefined(baker.freeSpace) ? baker.freeSpace.toFixed(2) : '--'} {TEZ_TOKEN_METADATA.symbol}
            </Text>
          </View>
          <Divider size={formatSize(16)} />
          <View>
            <Text style={styles.cellTitle}>Staking:</Text>
            <Text style={styles.cellValueText}>{kFormatter(baker.stakingBalance)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rewardsContainer}>
        <Text style={styles.rewardsText}>Rewards</Text>
        <Divider size={formatSize(6)} />
        <Icon name={IconNameEnum.SoonBadge} color={colors.gray3} size={formatSize(32)} />
      </View>

      <ScreenContainer>
        <ButtonDelegateSecondary
          title="View on TZKT block explorer"
          marginTop={formatSize(8)}
          marginBottom={formatSize(16)}
          onPress={() => openUrl(tzktUrl(baker.address))}
          disabled={!isDefined(baker.address)}
        />

        <Text style={styles.descriptionText}>
          For monitoring your rewards - subscribe to notifications from the{' '}
          <TextLink url="https://t.me/baking_bad_bot">Baking Bad bot</TextLink> in the telegram. The bot notifies users
          about received payments, expected rewards, and if a Baker underpays or misses payments.
        </Text>
      </ScreenContainer>
    </>
  );
};
