import React, { FC } from 'react';
import { Alert, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../components/icon/touchable-icon/touchable-icon';
import { RobotIcon } from '../../../components/robot-icon/robot-icon';
import { WalletAddress } from '../../../components/wallet-address/wallet-address';
import { AccountBaseInterface } from '../../../interfaces/account.interface';
import { ModalsEnum } from '../../../navigator/enums/modals.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { deleteContactAction } from '../../../store/contacts/contacts-actions';
import { formatSize } from '../../../styles/format-size';
import { getTruncatedProps } from '../../../utils/style.util';
import { useContactItemStyles } from './contact-item.styles';

interface Props {
  contact: AccountBaseInterface;
}

export const ContactItem: FC<Props> = ({ contact }) => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const styles = useContactItemStyles();

  const handleDeleteContact = (contact: AccountBaseInterface) => () =>
    Alert.alert(`Delete “${contact.name}” from Contacts?`, undefined, [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteContactAction(contact))
      }
    ]);

  const hadleEditItem = () => navigate(ModalsEnum.EditContact, contact);

  return (
    <View style={styles.root}>
      <View style={styles.accountContainer}>
        <RobotIcon seed={contact.publicKeyHash} />
        <View style={styles.accountContainerData}>
          <Text {...getTruncatedProps(styles.name)}>{contact.name}</Text>
          <WalletAddress publicKeyHash={contact.publicKeyHash} />
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableIcon name={IconNameEnum.Edit} size={formatSize(16)} onPress={hadleEditItem} />
        <Divider size={formatSize(24)} />
        <TouchableIcon name={IconNameEnum.Trash} size={formatSize(16)} onPress={handleDeleteContact(contact)} />
      </View>
    </View>
  );
};
