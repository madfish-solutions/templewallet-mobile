import React, { FC, memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { isAddress as isEvmAddress } from 'viem';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { NetworkIcon } from 'src/components/network-icon';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { TouchableIconV2 } from 'src/components/touchable-icon-v2';
import { TruncatedText } from 'src/components/truncated-text';
import { Contact } from 'src/interfaces/contact.interface';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { useContactItemStyles } from './contact-item.styles';
import { ContactItemSelector } from './selectors';

interface Props {
  contact: Contact;
  onPress: EmptyFn;
}

export const ContactItem = memo<Props>(({ contact, onPress }) => {
  const styles = useContactItemStyles();
  const network = isEvmAddress(contact.address) ? CryptoLogoNameEnum.Etherlink : CryptoLogoNameEnum.Tezos;

  return (
    <Pressable style={styles.root} onPress={onPress} testID={ContactItemSelector.item}>
      <View style={styles.accountContainer}>
        <RobotIcon seed={contact.address} size={formatSize(36)} color="blue" />
        <View style={styles.accountContainerData}>
          <TruncatedText style={styles.name}>{contact.name}</TruncatedText>
          <Text style={styles.address}>{truncateContactAddress(contact.address)}</Text>
        </View>
      </View>
      <NetworkIcon name={network} variant="badge" />
    </Pressable>
  );
});

interface DeleteButtonProps {
  onPress: EmptyFn;
}

export const ContactDeleteButton: FC<DeleteButtonProps> = ({ onPress }) => {
  const colors = useColors();
  const styles = useContactItemStyles();

  return (
    <View style={styles.hiddenRoot}>
      <TouchableIconV2
        name={IconNameV2Enum.Trash}
        size={formatSize(36)}
        iconSize={16}
        color={colors.destructive}
        style={styles.deleteButton}
        testID={ContactItemSelector.deleteButton}
        onPress={onPress}
      />
    </View>
  );
};

const truncateContactAddress = (address: string) =>
  address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
