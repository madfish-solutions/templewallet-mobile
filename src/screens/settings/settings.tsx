import React, { useState } from 'react';
import { Button, Text, TouchableOpacity } from 'react-native';
import { Dropdown } from '../../components/dropdown/dropdown';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ScreensEnum } from '../../navigator/screens.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { useWalletSelector } from '../../store/wallet/wallet-selectors';
import { EraseDataButton } from './erase-data-button/erase-data-button';
import { SettingsStyles } from './settings.styles';
import { AccountInterface } from '../../interfaces/account.interface';

export const Settings = () => {
  const { navigate } = useNavigation();
  const { lock } = useAppLock();
  const { revealSecretKey, revealSeedPhrase } = useShelter();
  const hdAccounts = useWalletSelector().hdAccounts;

  const [selectedAccount, setSelectedAccount] = useState<AccountInterface>();
  const handleDropdownValueChange = (item?: AccountInterface) => setSelectedAccount(item);

  return (
    <ScreenContainer>
      <Dropdown value={selectedAccount} list={hdAccounts} onValueChange={handleDropdownValueChange} />

      <Button title="Lock app" onPress={lock} />
      <EraseDataButton />
      <Text>List of your HD accounts:</Text>
      <Text style={SettingsStyles.description}>(press to reveal your private key)</Text>

      <TouchableOpacity style={SettingsStyles.accountItem} onPress={() => revealSeedPhrase()}>
        <Text>Seed phrase</Text>
      </TouchableOpacity>

      {hdAccounts.map(({ name, publicKeyHash }) => (
        <TouchableOpacity
          key={publicKeyHash}
          style={SettingsStyles.accountItem}
          onPress={() => revealSecretKey(publicKeyHash)}>
          <Text>{name}</Text>
          <Text>{publicKeyHash}</Text>
        </TouchableOpacity>
      ))}

      <Button title="+ Create new" onPress={() => navigate(ScreensEnum.CreateHdAccount)} />
    </ScreenContainer>
  );
};
