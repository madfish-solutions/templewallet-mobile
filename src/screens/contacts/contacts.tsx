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
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useContactsSelector } from 'src/store/contact-book/contact-book-selectors';
import { formatSize } from 'src/styles/format-size';

import { ContactItem } from './contact-item/contact-item';
import { ContactsSelectors } from './contacts.selectors';

/** padding size + robot icon size */
const FLOORED_ITEM_HEIGHT = Math.floor(formatSize(20) + formatSize(44));

const keyExtractor = (item: AccountBaseInterface) => item.publicKeyHash;

export const Contacts = memo(() => {
  const { navigate } = useNavigation();
  const contacts = useContactsSelector();

  useNavigationSetOptions(
    generateScreenOptions(
      <HeaderTitle title="Contacts" />,
      <HeaderButton
        iconName={IconNameEnum.PlusIconOrange}
        onPress={() => navigate(ModalsEnum.AddContact)}
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
      estimatedItemSize={FLOORED_ITEM_HEIGHT}
      ListEmptyComponent={ListEmptyComponent}
      testID={ContactsSelectors.contactItem}
    />
  );
});
