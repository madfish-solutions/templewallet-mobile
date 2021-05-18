import React, { useState } from 'react';
import { Button, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from '../../components/divider/divider';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { IconSegmentControl } from '../../components/segmented-control/icon-segment-control/icon-segment-control';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { ThemesEnum } from '../../interfaces/theme.enum';
import { ScreensEnum } from '../../navigator/screens.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { changeTheme } from '../../store/display-settings/display-settings-actions';
import { useThemeSelector } from '../../store/display-settings/display-settings-selectors';
import { useHdAccountsListSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { EraseDataButton } from './erase-data-button/erase-data-button';
import { useSettingsStyles } from './settings.styles';

export const Settings = () => {
  const styles = useSettingsStyles();
  const dispatch = useDispatch();
  const { lock } = useAppLock();
  const { navigate } = useNavigation();
  const { revealSecretKey, revealSeedPhrase } = useShelter();

  const [segmentedControlValue1, setSegmentedControlValue1] = useState(0);
  const [segmentedControlValue2, setSegmentedControlValue2] = useState(1);
  const [segmentedControlValue3, setSegmentedControlValue3] = useState(1);

  const theme = useThemeSelector();
  const hdAccounts = useHdAccountsListSelector();

  const isDarkTheme = theme === ThemesEnum.dark;

  const handleSwitchValueChange = (setDarkTheme: boolean) =>
    dispatch(changeTheme(setDarkTheme ? ThemesEnum.dark : ThemesEnum.light));

  return (
    <ScreenContainer>
      <TextSegmentControl
        selectedIndex={segmentedControlValue1}
        values={['HD', 'Imported']}
        onChange={setSegmentedControlValue1}
      />
      <Divider />

      <TextSegmentControl
        selectedIndex={segmentedControlValue2}
        values={['Light', 'Dark', 'System']}
        width={formatSize(200)}
        onChange={setSegmentedControlValue2}
      />
      <Divider />

      <IconSegmentControl
        selectedIndex={segmentedControlValue3}
        values={[IconNameEnum.Copy, IconNameEnum.Check]}
        width={formatSize(94)}
        onChange={setSegmentedControlValue3}
      />
      <Divider />

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
