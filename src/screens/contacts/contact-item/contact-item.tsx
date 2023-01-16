import { FC } from 'react';
import { Text, View } from 'react-native';

import { PublicKeyHashText } from '../../../components/public-key-hash-text/public-key-hash-text';
import { Contact } from '../../../store/contacts/contacts-state';
import { useContactItemStyles } from './contact-item.styles';

export const ContactItem: FC<Contact> = ({ name, address }) => {
  const styles = useContactItemStyles();

  return (
    <View>
      <Text style={styles.name}>{name}</Text>
      <PublicKeyHashText publicKeyHash={address} />
    </View>
  );
};
