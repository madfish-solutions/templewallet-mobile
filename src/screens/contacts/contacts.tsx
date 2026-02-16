import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { memo, useCallback, useMemo } from 'react';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { generateScreenOptions } from 'src/components/header/generate-screen-options.util';
import { HeaderButton } from 'src/components/header/header-button/header-button';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { useContactsSelector } from 'src/store/contact-book/contact-book-selectors';

import { ContactItem } from './contact-item/contact-item';
import { ContactsSelectors } from './contacts.selectors';

const keyExtractor = (item: AccountBaseInterface) => item.publicKeyHash;

export const Contacts = memo(() => {
  const navigateToModal = useNavigateToModal();
  const contacts = useContactsSelector();

  useNavigationSetOptions(
    generateScreenOptions(
      <HeaderTitle title="Contacts" />,
      <HeaderButton
        iconName={IconNameEnum.PlusIconOrange}
        onPress={() => navigateToModal(ModalsEnum.AddContact)}
        testID={ContactsSelectors.addContactButton}
      />
    ),
    []
  );

  const renderItem: ListRenderItem<AccountBaseInterface> = useCallback(
    ({ item, index }) => <ContactItem contact={item} index={index} />,
    []
  );

  const ListEmptyComponent = useMemo(() => <DataPlaceholder text="You have no contacts" />, []);

  return (
    <FlashList
      data={contacts}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListEmptyComponent={ListEmptyComponent}
      testID={ContactsSelectors.contactItem}
    />
  );
});
