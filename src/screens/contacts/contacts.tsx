import React from 'react';
import { FlatList } from 'react-native';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { generateScreenOptions } from '../../components/header/generate-screen-options.util';
import { HeaderButton } from '../../components/header/header-button/header-button';
import { HeaderTitle } from '../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useContactsSelector } from '../../store/contact-book/contact-book-selectors';
import { ContactItem } from './contact-item/contact-item';
import { ContactsSelectors } from './contacts.selectors';

export const Contacts = () => {
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

  return (
    <FlatList
      data={contacts}
      renderItem={({ item, index }) => <ContactItem contact={item} index={index} />}
      ListEmptyComponent={<DataPlaceholder text="You have no contacts" />}
      testID={ContactsSelectors.contact}
    />
  );
};
