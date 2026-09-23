import React, { memo, useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { generateScreenOptions } from 'src/components/header/generate-screen-options.util';
import { HeaderButton } from 'src/components/header/header-button/header-button';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { useDeleteContact } from 'src/hooks/use-delete-contact.hook';
import { Contact } from 'src/interfaces/contact.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { useContactsSelector } from 'src/store/contact-book/contact-book-selectors';
import { formatSize } from 'src/styles/format-size';

import { ContactDeleteButton, ContactItem } from './contact-item/contact-item';
import { ContactsSelectors } from './contacts.selectors';
import { useContactsStyles } from './contacts.styles';

const keyExtractor = (item: Contact) => item.address;

export const Contacts = memo(() => {
  const navigateToModal = useNavigateToModal();
  const contacts = useContactsSelector();
  const styles = useContactsStyles();
  const listRef = useRef<SwipeListView<Contact>>(null);
  const deleteContact = useDeleteContact();

  useNavigationSetOptions(
    generateScreenOptions(
      <HeaderTitle title="Contacts" />,
      <HeaderButton
        iconName={IconNameV2Enum.PlusBig}
        onPress={() => navigateToModal(ModalsEnum.AddContact)}
        testID={ContactsSelectors.addContactButton}
      />
    ),
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Contact; index: number }) => (
      <ContactItem contact={item} onPress={() => navigateToModal(ModalsEnum.EditContact, { contact: item, index })} />
    ),
    [navigateToModal]
  );

  const renderHiddenItem = useCallback(
    ({ item }: { item: Contact }) => (
      <ContactDeleteButton
        onPress={() => {
          listRef.current?.closeAllOpenRows();
          deleteContact(item);
        }}
      />
    ),
    [deleteContact]
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <DataPlaceholder text="You have no contacts" />
      </View>
    ),
    [styles.emptyContainer]
  );

  return (
    <View style={styles.root}>
      <SwipeListView
        ref={listRef}
        disableRightSwipe
        closeOnScroll
        closeOnRowPress
        data={contacts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={formatSize(-52)}
        stopRightSwipe={formatSize(-60)}
        contentContainerStyle={contacts.length ? styles.listContent : styles.emptyListContent}
        style={styles.list}
        ListEmptyComponent={ListEmptyComponent}
        testID={ContactsSelectors.contactItem}
      />
    </View>
  );
});
