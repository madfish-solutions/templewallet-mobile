import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';import { Button, Switch, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from '../../components/divider/divider';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ThemesEnum } from '../../interfaces/theme.enum';
import { ScreensEnum } from '../../navigator/screens.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { changeTheme } from '../../store/display-settings/display-settings-actions';
import { useThemeSelector } from '../../store/display-settings/display-settings-selectors';
import { useHdAccountsListSelector } from '../../store/wallet/wallet-selectors';
import { EraseDataButton } from './erase-data-button/erase-data-button';
import { useSettingsStyles } from './settings.styles';

export const Settings = () => {
  const styles = useSettingsStyles();
  const dispatch = useDispatch();
  const { lock } = useAppLock();
  const { navigate } = useNavigation();
  const { revealSecretKey, revealSeedPhrase } = useShelter();

  const theme = useThemeSelector();
  const hdAccounts = useHdAccountsListSelector();

  const isDarkTheme = theme === ThemesEnum.dark;

  const handleSwitchValueChange = (setDarkTheme: boolean) =>
    dispatch(changeTheme(setDarkTheme ? ThemesEnum.dark : ThemesEnum.light));

  return (
    <ScreenContainer>
      <View style={styles.darkAppearanceContainer}>
        <Label label="Dark Appearance" description="Manage the appearance of the app" />
        <Switch onValueChange={handleSwitchValueChange} value={isDarkTheme} />
      </View>
      <Divider />

      <Label label="Selected Account" description="You could switch between yours accounts" />

      <Divider />

      <Label label="List of your HD accounts:" description="(press to reveal your private key)" />
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
      <Divider />

      <Button title="Lock the App" onPress={lock} />
      <EraseDataButton />
    </ScreenContainer>
  );
};
