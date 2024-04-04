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

import { ImportAccountPrivateKey } from '../import-account/import-account-private-key/import-account-private-key';
import { ImportAccountSeed } from '../import-account/import-account-seed/import-account-seed';

import { useChooseAccountImportTypeStyles } from './styles';

enum ImportType {
  SeedPhrase = 'SeedPhrase',
  PrivateKey = 'PrivateKey'
}

export const ChooseAccountImportType = memo(() => {
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
        title: 'Private Key',
        description: 'Use your private key of the account you\n' + 'want to import',
        iconName: IconNameEnum.Key,
        onPress: () => setSelectedImportType(ImportType.PrivateKey)
      }
    ],
    []
  );

  const onBackPress = useCallback(() => setSelectedImportType(null), []);

  switch (selectedImportType) {
    case ImportType.SeedPhrase:
      return <ImportAccountSeed onBackPress={onBackPress} />;

    case ImportType.PrivateKey:
      return <ImportAccountPrivateKey onBackPress={onBackPress} />;

    default:
      return <ChooseWalletImportTypeContent importTypes={importTypes} />;
  }
});

interface Props {
  importTypes: ImportTypeItemProps[];
}

const ChooseWalletImportTypeContent = memo<Props>(({ importTypes }) => {
  const { goBack } = useNavigation();
  const styles = useChooseAccountImportTypeStyles();

  usePageAnalytic(ModalsEnum.ChooseAccountImportType);

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Import account" /> }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Divider size={formatSize(8)} />
          <Text style={styles.title}>Type of import</Text>
          <Text style={styles.description}>Select how would you like to import account.</Text>
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
