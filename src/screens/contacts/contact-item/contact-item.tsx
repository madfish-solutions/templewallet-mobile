import React, { FC } from 'react';
import { Alert, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { WalletAddress } from 'src/components/wallet-address/wallet-address';
import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { deleteContactAction } from 'src/store/contact-book/contact-book-actions';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { getTruncatedProps } from 'src/utils/style.util';

import { ContactItemAnalyticsEvents } from './analytics-events';
import { useContactItemStyles } from './contact-item.styles';
import { ContactItemSelector } from './selectors';

interface Props {
  contact: AccountBaseInterface;
  index: number;
}

export const ContactItem: FC<Props> = ({ contact, index }) => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const styles = useContactItemStyles();
  const { trackEvent } = useAnalytics();

  const handleDeleteContact = (contact: AccountBaseInterface) => () =>
    Alert.alert(`Delete “${contact.name}” from Contacts?`, undefined, [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => trackEvent(ContactItemAnalyticsEvents.DELETE_CONTACT_CANCEL, AnalyticsEventCategory.General)
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteContactAction(contact));
          trackEvent(ContactItemAnalyticsEvents.DELETE_CONTACT_SUCCESS, AnalyticsEventCategory.General);
        }
      }
    ]);

  const hadleEditItem = () => navigate(ModalsEnum.EditContact, { contact, index });

  return (
    <View style={styles.root}>
      <View style={styles.accountContainer}>
        <RobotIcon seed={contact.publicKeyHash} />
        <View style={styles.accountContainerData}>
          <Text {...getTruncatedProps(styles.name)}>{contact.name}</Text>
          <WalletAddress isLocalDomainNameShowing publicKeyHash={contact.publicKeyHash} />
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableIcon name={IconNameEnum.Edit} testID={ContactItemSelector.editButton} onPress={hadleEditItem} />
        <Divider size={formatSize(24)} />
        <TouchableIcon
          name={IconNameEnum.Trash}
          size={formatSize(16)}
          testID={ContactItemSelector.deleteButton}
          onPress={handleDeleteContact(contact)}
        />
      </View>
    </View>
  );
};
