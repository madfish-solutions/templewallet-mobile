import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../../../components/divider/divider';
import { HeaderButton } from '../../../../components/header/header-button/header-button';
import { HeaderTitle } from '../../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../../components/header/use-navigation-set-options.hook';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../../components/label/label';
import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { FormPasswordInput } from '../../../../form/form-password-input';
import { useShelter } from '../../../../shelter/use-shelter.hook';
import { CreateNewPasswordFormValues, createNewPasswordValidationSchema } from './create-new-password.form';
import { useCreateNewPasswordStyles } from './create-new-password.styles';

interface CreateNewPasswordProps {
  seedPhrase: string;
  useBiometry?: boolean;
  hdAccountsLength?: number;
  onGoBackPress: () => void;
}

export const CreateNewPassword: FC<CreateNewPasswordProps> = ({
  seedPhrase,
  useBiometry,
  hdAccountsLength,
  onGoBackPress
}) => {
  const { importWallet } = useShelter();
  const styles = useCreateNewPasswordStyles();

  const handleSubmit = ({ password }: CreateNewPasswordFormValues) =>
    importWallet({ seedPhrase, password, useBiometry, hdAccountsLength });

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderButton iconName={IconNameEnum.ArrowLeft} onPress={onGoBackPress} />,
      headerTitle: () => <HeaderTitle title="Create a new password" />
    },
    [onGoBackPress]
  );

  return (
    <Formik
      initialValues={{
        password: '',
        passwordConfirmation: ''
      }}
      validationSchema={createNewPasswordValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <Divider />
          <View>
            <Label label="Password" description="A password is used to protect the wallet." />
            <FormPasswordInput name="password" />

            <Label label="Repeat Password" description="Please enter the password again." />
            <FormPasswordInput name="passwordConfirmation" />
          </View>
          <View style={styles.buttonContainer}>
            <ButtonLargePrimary title="Sync" disabled={!isValid} onPress={submitForm} />
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
