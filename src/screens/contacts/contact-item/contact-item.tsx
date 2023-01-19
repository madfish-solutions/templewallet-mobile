import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../components/icon/touchable-icon/touchable-icon';
import { RobotIcon } from '../../../components/robot-icon/robot-icon';
import { WalletAddress } from '../../../components/wallet-address/wallet-address';
import { useDeleteContactHandler } from '../../../hooks/use-delete-contact.hook';
import { IAccountBase } from '../../../interfaces/account.interface';
import { ModalsEnum } from '../../../navigator/enums/modals.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { getTruncatedProps } from '../../../utils/style.util';
import { useContactItemStyles } from './contact-item.styles';

export const ContactItem: FC<IAccountBase> = ({ name, publicKeyHash }) => {
  const { navigate } = useNavigation();
  const styles = useContactItemStyles();
  const handleDeleteContact = useDeleteContactHandler({ name, publicKeyHash });

  const hadleEditItem = () => navigate(ModalsEnum.EditContact, { name, publicKeyHash });

  return (
    <View style={styles.root}>
      <View style={styles.accountContainer}>
        <RobotIcon seed={publicKeyHash} />
        <View style={styles.accountContainerData}>
          <Text {...getTruncatedProps(styles.name)}>{name}</Text>
          <WalletAddress publicKeyHash={publicKeyHash} />
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableIcon name={IconNameEnum.Edit} size={formatSize(16)} onPress={hadleEditItem} />
        <Divider size={formatSize(24)} />
        <TouchableIcon name={IconNameEnum.Trash} size={formatSize(16)} onPress={handleDeleteContact} />
      </View>
    </View>
  );
};
