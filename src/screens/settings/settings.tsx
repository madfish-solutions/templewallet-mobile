import React from 'react';
import { Button, Switch, Text, TouchableOpacity, View } from 'react-native';
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
import { useSettingsStyles } from './settings.styles';

export const Settings = () => {
  const styles = useSettingsStyles();
  const dispatch = useDispatch();
  const { lock } = useAppLock();
  const { navigate } = useNavigation();
  const { revealSecretKey, revealSeedPhrase } = useShelter();

  const hdAccounts = useWalletSelector().hdAccounts;
  const theme = useThemeSelector();

  const isDarkTheme = theme === ThemesEnum.dark;

  const handleSwitchValueChange = (setDarkTheme: boolean) =>
    dispatch(changeTheme(setDarkTheme ? ThemesEnum.dark : ThemesEnum.light));

  return (
    <ScreenContainer>
      <View style={styles.darkAppearanceContainer}>
        <Text>Dark Appearance</Text>
        <Switch onValueChange={handleSwitchValueChange} value={isDarkTheme} />
      </View>
      <View style={styles.testContainer} />
      <Button title="Lock app" onPress={lock} />
      <EraseDataButton />
      <Text>List of your HD accounts:</Text>
      <Text style={styles.description}>(press to reveal your private key)</Text>

      <TouchableOpacity style={styles.accountItem} onPress={() => revealSeedPhrase()}>
        <Text>Seed phrase</Text>
      </TouchableOpacity>

      {hdAccounts.map(({ name, publicKeyHash }) => (
        <TouchableOpacity key={publicKeyHash} style={styles.accountItem} onPress={() => revealSecretKey(publicKeyHash)}>
          <Text>{name}</Text>
          <Text>{publicKeyHash}</Text>
        </TouchableOpacity>
      ))}

      <Button title="+ Create new" onPress={() => navigate(ScreensEnum.CreateHdAccount)} />
    </ScreenContainer>
  );
};
