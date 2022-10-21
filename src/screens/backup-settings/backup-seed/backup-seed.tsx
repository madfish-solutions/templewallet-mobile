import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { CheckboxLabel } from '../../../components/checkbox-description/checkbox-label';
import { Divider } from '../../../components/divider/divider';
import { HeaderBackButton } from '../../../components/header/header-back-button/header-back-button';
import { HeaderProgress } from '../../../components/header/header-progress/header-progress';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { NewSeedPhraseAttention } from '../../../components/new-seed-phrase-attention/new-seed-phrase-attention';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { FormCheckbox } from '../../../form/form-checkbox';
import { FormMnemonicCreate } from '../../../form/form-mnemonic-create';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { formatSize } from '../../../styles/format-size';
import { usePageAnalytic } from '../../../utils/analytics/use-analytics.hook';
import { BackupSeedValidationSchema, BackupSeedFormValues } from './backup-seed.form';
import { BackupSeedSelectors } from './backup-seed.selectors';
import { useBackupSeedStyles } from './backup-seed.styles';

interface BackupSeedProps {
  initialSeedPhrase: string;
  onSubmit: (formValues: BackupSeedFormValues) => void;
}

export const BackupSeed: FC<BackupSeedProps> = ({ initialSeedPhrase, onSubmit }) => {
  const styles = useBackupSeedStyles();

  const BackupSeedInitialValues: BackupSeedFormValues = useMemo(
    () => ({
      seedPhrase: initialSeedPhrase,
      madeSeedPhraseBackup: false
    }),
    [initialSeedPhrase]
  );

  usePageAnalytic('Backup manually' as ScreensEnum);

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderBackButton />,
      headerTitle: () => <HeaderTitle title="Backup manually" />,
      headerRight: () => <HeaderProgress current={1} total={2} />
    },
    []
  );

  return (
    <Formik initialValues={BackupSeedInitialValues} validationSchema={BackupSeedValidationSchema} onSubmit={onSubmit}>
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <Divider size={formatSize(12)} />
          <View style={styles.seedPhraseInputContainer}>
            <Label
              label="Seed phrase"
              description="If you ever switch between browsers or devices, you will need this seed phrase to access your accounts."
            />
            <FormMnemonicCreate name="seedPhrase" testID={BackupSeedSelectors.SeedPhraseOut} />
          </View>

          <View>
            <NewSeedPhraseAttention />
            <Divider />
            <View style={styles.checkboxContainer}>
              <FormCheckbox name="madeSeedPhraseBackup" testID={BackupSeedSelectors.MadeSeedPhraseBackupCheckbox}>
                <Divider size={formatSize(8)} />
                <Text style={styles.checkboxText}>I made Seed Phrase backup</Text>
              </FormCheckbox>
            </View>
            <CheckboxLabel>And accept the risks that if I lose the phrase,{'\n'}my funds may be lost.</CheckboxLabel>
            <Divider />
          </View>
          <View>
            <ButtonsContainer>
              <ButtonLargePrimary
                title="Next"
                disabled={!isValid}
                onPress={submitForm}
                testID={BackupSeedSelectors.NextButton}
              />
            </ButtonsContainer>
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
