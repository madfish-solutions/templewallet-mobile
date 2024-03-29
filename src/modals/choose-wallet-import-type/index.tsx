import React, { memo, useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ImportTypeItem, ImportTypeItemProps } from 'src/components/import-type-item';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { ImportWallet } from '../import-wallet/import-wallet';
import { SyncInstructions } from '../sync-account/sync-instructions/sync-instructions';

import { useChooseWalletImportTypeStyles } from './styles';

enum ImportType {
  SeedPhrase = 'SeedPhrase',
  KeystoreFile = 'KeystoreFile',
  Sync = 'Sync'
}

export const ChooseWalletImportType = memo(() => {
  const [selectedImportType, setSelectedImportType] = useState<ImportType | null>(null);

  const importTypes: ImportTypeItemProps[] = useMemo(
    () => [
      {
        title: 'Seed Phrase',
        description: 'Use your seed phrase from Temple Wallet\n' + 'or another crypto wallet',
        iconName: IconNameEnum.Docs,
        onPress: () => setSelectedImportType(ImportType.SeedPhrase)
      },
      {
        title: 'Sync with Extension Wallet',
        description: 'Synchronize your mobile and extension\n' + 'Temple Wallet',
        iconName: IconNameEnum.Sync,
        onPress: () => setSelectedImportType(ImportType.Sync)
      },
      {
        title: 'Keystore File',
        description: 'Import your wallet from an encrypted\n' + 'keystore file (.tez)',
        iconName: IconNameEnum.FileUpload,
        onPress: () => setSelectedImportType(ImportType.KeystoreFile)
      }
    ],
    []
  );

  const onBackPress = useCallback(() => setSelectedImportType(null), []);

  const renderContent = useCallback(() => {
    switch (selectedImportType) {
      case ImportType.SeedPhrase:
        return <ImportWallet onBackPress={onBackPress} />;

      case ImportType.KeystoreFile:
        return <ImportWallet fromSeed={false} onBackPress={onBackPress} />;

      case ImportType.Sync:
        return <SyncInstructions onBackPress={onBackPress} />;

      default:
        return <ChooseWalletImportTypeContent importTypes={importTypes} />;
    }
  }, [importTypes, onBackPress, selectedImportType]);

  return renderContent();
});

interface Props {
  importTypes: ImportTypeItemProps[];
}

const ChooseWalletImportTypeContent = memo<Props>(({ importTypes }) => {
  const { goBack } = useNavigation();
  const styles = useChooseWalletImportTypeStyles();

  usePageAnalytic(ModalsEnum.ChooseWalletImportType);

  useNavigationSetOptions(
    { headerTitle: () => <HeaderTitle title="Import Existing Wallet" />, headerLeft: () => null },
    []
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Divider size={formatSize(8)} />
          <Text style={styles.title}>Type of import</Text>
          <Text style={styles.description}>Choose how would you like to import account.</Text>
        </View>

        <View>
          {importTypes.map(item => (
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
