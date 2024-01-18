import React, { memo, useMemo } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ImportTypeItem, ImportTypeItemProps } from 'src/components/import-type-item';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { useChooseWalletImportTypeStyles } from './styles';

export const ChooseWalletImportType = memo(() => {
  usePageAnalytic(ModalsEnum.ChooseWalletImportType);

  const styles = useChooseWalletImportTypeStyles();
  const { navigate, goBack } = useNavigation();

  const ImportTypes: ImportTypeItemProps[] = useMemo(
    () => [
      {
        title: 'Seed Phrase',
        description: 'Use your seed phrase from Temple Wallet\n' + 'or another crypto wallet',
        iconName: IconNameEnum.Docs,
        onPress: () => navigate(ModalsEnum.ImportWalletFromSeedPhrase)
      },
      {
        title: 'Sync with Extension Wallet',
        description: 'Synchronize your mobile and extension\n' + 'Temple Wallet',
        iconName: IconNameEnum.Sync,
        onPress: () => navigate(ModalsEnum.SyncInstructions)
      },
      {
        title: 'Keystore File',
        description: 'Import your wallet from an encrypted\n' + 'keystore file (.tez)',
        iconName: IconNameEnum.FileUpload,
        onPress: () => navigate(ModalsEnum.ImportWalletFromKeystoreFile)
      }
    ],
    [navigate]
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Divider size={formatSize(8)} />
          <Text style={styles.title}>Type of import</Text>
          <Text style={styles.description}>Select how would you like to import account.</Text>
        </View>

        <View>
          {ImportTypes.map(item => (
            <View key={item.title}>
              <Divider size={formatSize(16)} />
              <ImportTypeItem {...item} />
            </View>
          ))}
        </View>
      </View>
      <ButtonsFloatingContainer>
        <ButtonLargeSecondary title="Close" style={styles.button} onPress={goBack} />
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </>
  );
});
