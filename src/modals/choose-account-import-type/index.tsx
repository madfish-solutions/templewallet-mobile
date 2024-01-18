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

import { useChooseAccountImportTypeStyles } from './styles';

export const ChooseAccountImportType = memo(() => {
  usePageAnalytic(ModalsEnum.ChooseAccountImportType);

  const styles = useChooseAccountImportTypeStyles();
  const { navigate, goBack } = useNavigation();

  const ImportTypes: ImportTypeItemProps[] = useMemo(
    () => [
      {
        title: 'Seed Phrase',
        description: 'Use your seed phrase from Temple Wallet\n' + 'or another crypto wallet',
        iconName: IconNameEnum.Docs,
        onPress: () => navigate(ModalsEnum.ImportAccountFromSeedPhrase)
      },
      {
        title: 'Private Key',
        description: 'Use your private key of the account you\n' + 'want to import',
        iconName: IconNameEnum.Key,
        onPress: () => navigate(ModalsEnum.ImportAccountFromPrivateKey)
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
