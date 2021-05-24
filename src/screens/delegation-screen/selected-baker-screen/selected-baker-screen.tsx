import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { ButtonDelegateSecondary } from '../../../components/button/button-large/button-delegate-secondary/button-delegate-secondary';
import { Divider } from '../../../components/divider/divider';
import { ExternalLinkButton } from '../../../components/icon/external-link-button/external-link-button';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TextLink } from '../../../components/text-link/text-link';
import { PublicKeyHashText } from '../../../components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from '../../../components/robot-icon/robot-icon';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { BakerInterface } from '../../../interfaces/baker.interface';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { openUrl } from '../../../utils/linking.util';
import { useSelectedBakerScreenStyles } from './selected-baker-screen.styles';

interface Props {
  baker: BakerInterface;
}

export const SelectedBakerScreen: FC<Props> = ({ baker }) => {
  const colors = useColors();
  const styles = useSelectedBakerScreenStyles();

  const tzktUrl = `https://tzkt.io/${baker.address}`;

  return (
    <>
      <View style={styles.bakerCard}>
        <View style={styles.upperContainer}>
          <View style={styles.bakerContainer}>
            <RobotIcon seed={baker.address} />
            <View style={styles.bakerContainerData}>
              <Text style={styles.nameText}>{baker.name}</Text>
              <View style={styles.actionsContainer}>
                <PublicKeyHashText publicKeyHash={baker.address} />
                <Divider size={formatSize(4)} />
                <ExternalLinkButton url={tzktUrl} />
              </View>
            </View>
          </View>

          <Text>REDELEGATE</Text>
        </View>

        <Divider size={formatSize(8)} />

        <View style={styles.lowerContainer}>
          <View>
            <Text style={styles.cellTitle}>Baker fee:</Text>
            <Text style={styles.cellValueText}>{baker.fee * 100}%</Text>
          </View>
          <Divider size={formatSize(16)} />
          <View>
            <Text style={styles.cellTitle}>Space:</Text>
            <Text style={styles.cellValueText}>{baker.freeSpace.toFixed(2)} XTZ</Text>
          </View>
          <Divider size={formatSize(16)} />
          <View>
            <Text style={styles.cellTitle}>Cycles:</Text>
            <Text style={styles.cellValueText}>XXX</Text>
          </View>
        </View>
      </View>

      <View style={styles.rewardsContainer}>
        <Text style={styles.rewardsText}>Rewards</Text>
        <Icon name={IconNameEnum.SoonBadge} color={colors.gray3} size={formatSize(32)} />
      </View>

      <ScreenContainer>
        <ButtonDelegateSecondary
          title="View on TZKT block explorer"
          marginTop={formatSize(8)}
          marginBottom={formatSize(16)}
          onPress={() => openUrl(tzktUrl)}
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
