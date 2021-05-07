import React from 'react';
import { Button, Switch, Text, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ThemesEnum } from '../../interfaces/theme.enum';
import { ScreensEnum } from '../../navigator/screens.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { changeTheme } from '../../store/display-settings/display-settings-actions';
import { useThemeSelector } from '../../store/display-settings/display-settings-selectors';
import { useWalletSelector } from '../../store/wallet/wallet-selectors';
import { EraseDataButton } from './erase-data-button/erase-data-button';
import { SettingsStyles } from './settings.styles';

export const Settings = () => {
  const { navigate } = useNavigation();
  const { lock } = useAppLock();
  const { revealSecretKey, revealSeedPhrase } = useShelter();
  const hdAccounts = useWalletSelector().hdAccounts;

  const theme = useThemeSelector();
  const dispatch = useDispatch();
  const toggleTheme = () => dispatch(changeTheme(theme === ThemesEnum.light ? ThemesEnum.dark : ThemesEnum.light));

  return (
    <ScreenContainer>
      <Text>Light</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={theme === ThemesEnum.dark ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleTheme}
        value={theme === ThemesEnum.dark}
      />
      <Text>Dark</Text>
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
